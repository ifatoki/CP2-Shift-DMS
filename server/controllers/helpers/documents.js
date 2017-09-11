import lodash from 'lodash';
import { Document, Role } from '../../models';
import errors from '../helpers/errors';
import errorManagers from '../helpers/errorManagers';
import genericHelpers from '../helpers/genericHelpers';
import Validator from '../../utils/Validator';

const {
  throwError,
  handleErrors,
} = errorManagers;

const {
  documentErrors,
  genericErrors
} = errors;

const {
  resolveNull,
  resolveRightId
} = genericHelpers;

/**
 * Create a string of all the validation errors.
 * @function getValidatorErrorMessage
 *
 * @param {Object} errors - An errors Object
 *
 * @returns {string} A compilation of the errors
 */
const getValidatorErrorMessage = validationErrors => (
  lodash.reduce(validationErrors, (result, error) =>
    `${error}\n${result}`
  , '')
);

const getRolesExcludingOverlord = (rolesIds) => {
  const constraints = {
    where: {
      id: {
        $and: {
          $ne: 1
        }
      }
    }
  };
  if (rolesIds.length) constraints.where.id.$and.$in = rolesIds;
  Role
  .findAll(constraints);
};

const mapRolesToRights = (roles) => {
  lodash.map(roles, (role) => {
    role.DocumentRole = {
      rightId: roles[role.id]
    };
    return role;
  });
};

/**
 * Filter out document properties
 * @function filterDocument
 *
 * @param {Object} document - Document Object
 *
 * @return {Object} A filtered document
 */
const filterDocument = ({
  id, title, content, updatedAt, ownerId, accessId
}) => ({
  id, title, content, updatedAt, ownerId, accessId
});

const setRolesToDocument = (roles, document) => {
  if (roles.length) {
    return document.setRoles(roles)
    .then(() => ({
      document: filterDocument(document),
      roles: lodash.map(roles, role => ({
        id: role.id,
        title: role.title
      }))
    }));
  }
  return Promise.resolve({ document });
};

const documents = {
  /**
   * Filter out document properties
   * @function filterDocument
   *
   * @param {id} id - Id of the requested document
   * @return {Object} A filtered document
   */
  filterDocument({
    id, title, content, updatedAt, ownerId, accessId
  }) {
    return {
      id,
      title,
      content,
      updatedAt,
      ownerId,
      accessId,
    };
  },

  getDocumentById(id) {
    return Document.findById(id)
      .catch((error) => {
        throwError(isNaN(parseInt(id, 10)) ?
          genericErrors.INVALID_ID : error.message);
      });
  },

  getDocumentByTitle(title) {
    return Document.findOne({
      where: {
        title
      }
    });
  },

  createDocument(documentData) {
    return Document.create(documentData);
  },

  addRolesToDocument(document, { accessId, roles, rolesIds }) {
    if (accessId === 3 && roles && rolesIds.length > 0) {
      return getRolesExcludingOverlord(rolesIds)
      .then((fetchedRoles) => {
        fetchedRoles = mapRolesToRights(fetchedRoles);
        return setRolesToDocument(fetchedRoles, document);
      });
    }
    return Promise.resolve({
      document: filterDocument(document)
    });
  },

  getSharedDocumentsUserRight(document, userId, roleId) {
    return document.getRoles({
      where: {
        id: roleId
      },
      joinTableAttributes: ['rightId']
    })
    .then(roles => resolveRightId(roles, false))
    .then((returnValue) => {
      if (returnValue === -1) {
        return document.getUsers({
          where: {
            id: userId
          },
          joinTableAttributes: ['rightId']
        })
        .then(users => resolveRightId(users, true));
      }
      return returnValue;
    });
  },

  getCurrentUserRight(document, userId, roleId) {
    const returnDocument = { ...document };
    if (document.dataValues.ownerId === userId) {
      returnDocument.dataValues.rightId = 1;
      return returnDocument;
    }
    if (document.dataValues.accessId === 1) {
      throwError(documentErrors.DOCUMENT_UNAUTHORIZED_ACCESS);
    }
    if (document.dataValues.accessId === 2) {
      returnDocument.dataValues.rightId = 3;
      return returnDocument;
    }
    return documents.getSharedDocumentsUserRight(document, userId, roleId)
    .then((rightId) => {
      if (rightId < 0) throwError(documentErrors.DOCUMENT_UNAUTHORIZED_ACCESS);
      returnDocument.dataValues.rightId = rightId;
      return returnDocument;
    });
  }
};

const fetchOne = (req, res) => {
  documents.getDocumentById(req.params.id)
  .then(document =>
    resolveNull(document, documentErrors.DOCUMENT_NOT_FOUND))
  .then(document =>
    documents.getCurrentUserRight(document, req.userId, req.roleId))
  .then((documentWithRight) => {
    const responseDocument = {};
    responseDocument.document =
      documents.filterDocument(documentWithRight.dataValues);
    responseDocument.rightId = documentWithRight.dataValues.rightId;
    res.status(200).send(responseDocument);
  })
  .catch(error => handleErrors(error, res));
};

const create = (req, res) => {
  const {
    title, content, accessId, roles
  } = req.body;

  const documentData = {
    title,
    content,
    accessId,
    ownerId: req.userId,
  };
  const validation = Validator.validateNewDocument(documentData);
  if (validation.isValid) {
    if (roles) {
      documentData.accessId =
        Object.keys(roles).length ? 3 : accessId;
      documentData.rolesIds = Object.keys(roles);
      documentData.roles = roles;
    }
    documents.getDocumentByTitle(title)
    .then(document => new Promise((resolve) => {
      if (document) {
        throwError(documentErrors.DOCUMENT_DUPLICATE_TITLE);
      }
      return resolve(true);
    })
    .then(() => documents.createDocument(documentData))
    .then(newDocument =>
      documents.addRolesToDocument(newDocument, documentData))
    .then(newDocument => res.status(201).send({
      document: filterDocument(newDocument.document)
    }))
    .catch(error => handleErrors(error, res)));
  } else {
    res.status(400).send({
      message: getValidatorErrorMessage(validation.errors)
    });
  }
};

export { fetchOne, create, documents };
