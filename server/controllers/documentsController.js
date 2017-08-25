import _ from 'lodash';
import { User, Document, Role } from '../models';
import Validator from '../utils/Validator';

/**
 * Returns a 500 server error with the server response
 * @function returnServerError
 *
 * @param {any} res
 * @returns {void}
 */
const returnServerError = res => (
  res.status(500).send({
    message: 'oops, we just encountered an error. please try again'
  })
);

/**
 * @function getValidatorErrorMessage
 *
 * @param {any} errors
 * @returns {string} A compilation of the errors
 */
const getValidatorErrorMessage = errors => (
  _.reduce(errors, (result, error) =>
    `${error}\n${result}`
  , '')
);

/**
 * @function filterDocument
 *
 * @param {any} document
 * @return {any} A filtered document
 */
const filterDocument = document => ({
  id: document.id,
  title: document.title,
  content: document.content,
  updatedAt: document.updatedAt,
  ownerId: document.ownerId,
  accessId: document.accessId
});

/**
 * @function deleteDocument
 *
 * @param {any} document
 * @param {any} req
 * @param {any} res
 * @return {void}
 */
const deleteDocument = (document, req, res) => {
  document.destroy({
    cascade: true
  })
  .then(() => res.status(200).send({
    message: 'document deleted successfully'
  }))
  .catch(() => returnServerError(res));
};

/**
 * @function addRolesToDocument
 *
 * @param {any} req
 * @param {any} res
 * @param {any} newDocument
 * @param {any} documentData
 * @returns {void}
 */
const addRolesToDocument = (req, res, newDocument, documentData) => {
  Role
  .findAll({
    where: {
      id: {
        $and: {
          $in: documentData.rolesIds,
          $ne: 1
        }
      }
    }
  })
  .then((roles) => {
    _.map(roles, (role) => {
      role.DocumentRole = {
        rightId: documentData.roles[role.id]
      };
      return role;
    });
    if (roles.length) {
      newDocument.setRoles(roles)
      .then(() => {
        res.status(201).send({
          document: filterDocument(newDocument),
          roles: _.map(roles, role => ({
            id: role.id,
            title: role.title
          }))
        });
      })
      .catch(() => returnServerError(res));
    } else {
      res.status(201).send({
        document: filterDocument(newDocument)
      });
    }
  })
  .catch(() => returnServerError(res));
};

/**
 * @function updateDocument
 *
 * @param {any} document
 * @param {any} req
 * @param {any} res
 * @returns {void}
 */
const updateDocument = (document, req, res) => {
  const formerAccessId = document.accessId;
  const documentData = {
    title: req.body.title || document.title,
    content: req.body.content || document.content,
    accessId: req.body.accessId || document.accessId
  };
  if (req.body.roles) {
    documentData.accessId =
      Object.keys(req.body.roles).length ? 3 : req.body.accessId;
    documentData.rolesIds = Object.keys(req.body.roles);
    documentData.roles = req.body.roles;
  }
  document.update(documentData)
  .then((updatedDocument) => {
    if (updatedDocument.accessId === 3 &&
      documentData.roles &&
      documentData.rolesIds.length > 0
    ) {
      addRolesToDocument(req, res, updatedDocument, documentData);
    } else if (formerAccessId === 3 && updatedDocument.accessId !== 3) {
      updatedDocument.setRoles([])
      .then(() => {
        res.status(200).send({
          document: filterDocument(updatedDocument)
        });
      })
      .catch(() => returnServerError(res));
    } else {
      res.status(200).send({
        document: filterDocument(updatedDocument)
      });
    }
  })
  .catch(() => returnServerError(res));
};

const returnDocumentNotFound = res => (
  res.status(404).send({
    message: 'document not found'
  })
);

const documentsController = {
  /**
   * @function create
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  create: (req, res) => {
    const documentData = {
      title: req.body.title,
      content: req.body.content,
      ownerId: req.userId,
      accessId: req.body.accessId
    };
    if (req.body.roles) {
      documentData.accessId =
        Object.keys(req.body.roles).length ? 3 : req.body.accessId;
      documentData.rolesIds = Object.keys(req.body.roles);
      documentData.roles = req.body.roles;
    }
    const validation = Validator.validateNewDocument(documentData);
    if (validation.isValid) {
      Document
      .findOne({
        where: {
          title: req.body.title
        }
      })
      .then((document) => {
        if (document) {
          res.status(403).send({
            message: 'a document with that title already exists'
          });
        } else {
          Document
            .create(documentData)
            .then((newDocument) => {
              if (documentData.accessId === 3 &&
                documentData.roles &&
                documentData.rolesIds.length > 0
              ) {
                addRolesToDocument(req, res, newDocument, documentData);
              } else {
                res.status(201).send({
                  document: filterDocument(newDocument)
                });
              }
            })
            .catch(() => returnServerError(res));
        }
      })
      .catch(() => returnServerError(res));
    } else {
      res.status(400).send({
        message: getValidatorErrorMessage(validation.errors)
      });
    }
  },

  /**
   * @function fetchAll
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  fetchAll: (req, res) => {
    const query = {};
    switch (req.query.type) {
    case 'public':
      query.accessId = 2;
      break;
    case 'role':
    case 'shared':
      query.ownerId = req.userId;
      break;
    default:
      query.accessId = 1;
      query.ownerId = req.userId;
      break;
    }
    if (!query.accessId) {
      User
        .findById(req.userId)
        .then((user) => {
          if (req.query.type === 'role') {
            Role.findById(user.roleId)
            .then((role) => {
              role.getDocuments({
                order: '"updatedAt" DESC'
              })
              .then((documents) => {
                res.status(200).send({ documents });
              })
              .catch(() => returnServerError(res));
            });
          } else {
            user.getDocuments({
              order: '"updatedAt" DESC'
            })
            .then((documents) => {
              res.status(200).send({ documents });
            })
            .catch(() => returnServerError(res));
          }
        })
        .catch(() => returnServerError(res));
    } else {
      Document
        .findAndCountAll({
          where: query,
          order: '"updatedAt" DESC',
          limit: req.query.limit || null,
          offset: req.query.offset
        })
        .then(documents =>
          res.status(200).send({
            documents: documents.rows,
            count: documents.count
          }))
        .catch(error => res.status(400).send({
          message: error.message
        }));
    }
  },

  /**
   * @function fetchOne
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  fetchOne: (req, res) => {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          returnDocumentNotFound(res);
        } else {
          const response = { document: filterDocument(document) };
          if (document.ownerId === req.userId) {
            response.rightId = 1;
            if (document.accessId === 3) {
              document.getRoles({
                joinTableAttributes: ['rightId']
              })
              .then((roles) => {
                const documentRoles = _.map(
                  roles, role => role.dataValues.id);
                response.documentRoles = documentRoles;
                res.status(200).send(response);
              })
              .catch(() => returnServerError(res));
            } else {
              res.status(200).send(response);
            }
          } else if (document.accessId === 2) {
            response.rightId = 3;
            res.status(200).send(response);
          } else {
            document.getUsers({
              where: {
                id: req.userId
              },
              joinTableAttributes: ['rightId']
            })
            .then((user) => {
              if (user.length < 1) {
                document.getRoles({
                  joinTableAttributes: ['rightId']
                })
                .then((roles) => {
                  if (roles.length < 1) {
                    res.status(401).send({
                      message: 'you are not authorized to access this document'
                    });
                  } else {
                    const newRoles = _.map(roles, role => role.dataValues);
                    const documentRoles = _.map(
                      roles, role => role.dataValues.id);
                    const userRole = _.find(newRoles, { 'id': req.roleId });
                    response.rightId =
                      userRole.DocumentRole.dataValues.rightId;
                    response.documentRoles = documentRoles;
                    res.status(200).send(response);
                  }
                })
                .catch(() => returnServerError(res));
              } else {
                response.rightId =
                  user[0].dataValues.DocumentUser.dataValues.rightId;
                res.status(200).send(response);
              }
            })
            .catch(() => returnServerError(res));
          }
        }
      })
      .catch(error => res.status(400).send({
        message: error.message
      }));
  },

  /**
   * @function update
   *
   * @param {any} req
   * @param {any} res
   * @return {void}
   */
  update: (req, res) => {
    const documentData = {
      title: req.body.title,
      content: req.body.content,
      accessId: req.body.accessId
    };

    const validation = Validator.validateDocumentEdit(documentData);
    if (validation.isValid) {
      Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          returnDocumentNotFound(res);
        } else {
          Document
            .findOne({
              where: {
                title: req.body.title,
                id: {
                  $ne: document.id
                }
              }
            })
            .then((duplicateDocument) => {
              if (duplicateDocument) {
                res.status(403).send({
                  message: 'a document with that title already exists'
                });
              } else if (document.ownerId === req.userId) {
                updateDocument(document, req, res);
              } else if (document.accessId === 2) {
                res.status(403).send({
                  message: "you don't have the rights to edit this document"
                });
              } else {
                document.getUsers({
                  where: {
                    id: req.userId
                  },
                  joinTableAttributes: ['rightId']
                })
                .then((user) => {
                  if (user.length < 1) {
                    document.getRoles({
                      where: {
                        id: req.roleId
                      },
                      joinTableAttributes: ['rightId']
                    })
                    .then((role) => {
                      if (role.length < 1) {
                        res.status(401).send({
                          message:
                            'you are not authorized to access this document'
                        });
                      } else if (
                        role[0].dataValues.DocumentRole.dataValues.rightId < 3
                      ) {
                        updateDocument(document, req, res);
                      } else {
                        res.status(403).send({
                          message:
                            "you don't have the rights to edit this document"
                        });
                      }
                    })
                    .catch(() => returnServerError(res));
                  } else if (
                    user[0].dataValues.DocumentUser.dataValues.rightId < 3
                  ) {
                    updateDocument(document, req, res);
                  } else {
                    res.status(403).send({
                      message:
                        "you don't have the rights to edit this document"
                    });
                  }
                })
                .catch(error => res.status(400).send({
                  message: error.message
                }));
              }
            })
            .catch(() => returnServerError(res));
        }
      })
      .catch(() => returnServerError(res));
    } else {
      res.status(400).send({
        message: getValidatorErrorMessage(validation.errors)
      });
    }
  },

  /**
   * @function delete
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  delete: (req, res) => {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          returnDocumentNotFound(res);
        } else if (document.ownerId === req.userId) {
          deleteDocument(document, req, res);
        } else if (document.accessId === 2) {
          if (req.roleId === 1) {
            deleteDocument(document, req, res);
          } else {
            res.status(403).send({
              message: "you don't have the rights to delete this document"
            });
          }
        } else {
          document.getUsers({
            where: {
              id: req.userId
            },
            joinTableAttributes: ['rightId']
          })
          .then((user) => {
            if (user.length < 1) {
              document.getRoles({
                where: {
                  id: req.roleId
                },
                joinTableAttributes: ['rightId']
              })
              .then((role) => {
                if (role.length < 1) {
                  res.status(401).send({
                    message:
                      'you are not authorized to access this document'
                  });
                } else if (
                  role[0].dataValues.DocumentRole.dataValues.rightId === 1
                ) {
                  deleteDocument(document, req, res);
                } else {
                  res.status(403).send({
                    message:
                      "you don't have the rights to delete this document"
                  });
                }
              })
              .catch(() => returnServerError(res));
            } else if (
              user[0].dataValues.DocumentUser.dataValues.rightId === 1
            ) {
              deleteDocument(document, req, res);
            } else {
              res.status(403).send({
                message:
                  "you don't have the rights to delete this document"
              });
            }
          })
          .catch(() => returnServerError(res));
        }
      })
      .catch(() => returnServerError(res));
  },

  /**
   * @function search
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  search: (req, res) => {
    const searchResults = {};
    User
      .findById(req.userId)
      .then((user) => {
        if (user) {
          user.getDocuments({
            where: {
              title: {
                $ilike: `%${req.query.q}%`
              }
            },
            attributes: ['id', 'title'],
            joinTableAttributes: []
          })
            .then((sharedDocuments) => {
              if (sharedDocuments.length) {
                searchResults.shared = {
                  name: 'shared',
                  results: sharedDocuments
                };
              }
              user.getMyDocuments({
                where: {
                  title: {
                    $ilike: `%${req.query.q}%`
                  }
                },
                attributes: ['id', 'title']
              })
                .then((myDocuments) => {
                  if (myDocuments.length) {
                    searchResults.authored = {
                      name: 'authored',
                      results: myDocuments
                    };
                  }
                  Role
                    .findById(req.roleId)
                    .then((role) => {
                      if (role) {
                        role.getDocuments({
                          where: {
                            title: {
                              $ilike: `%${req.query.q}%`
                            }
                          },
                          attributes: ['id', 'title'],
                          joinTableAttributes: []
                        })
                          .then((roleDocuments) => {
                            if (roleDocuments.length) {
                              searchResults.role = {
                                name: 'role',
                                results: roleDocuments
                              };
                            }
                            Document
                              .findAll({
                                where: {
                                  accessId: 2,
                                  title: { $ilike: `%${req.query.q}%` }
                                },
                                attributes: ['id', 'title']
                              })
                              .then((publicDocuments) => {
                                if (publicDocuments.length) {
                                  searchResults.public = {
                                    name: 'public',
                                    results: publicDocuments
                                  };
                                }
                                res.status(200).send(searchResults);
                              })
                              .catch(() => returnServerError(res));
                          });
                      } else {
                        res.status(404).send({
                          message: 'role not found'
                        });
                      }
                    })
                    .catch(error => res.status(400).send({
                      message: error.message
                    }));
                })
                .catch(() => returnServerError(res));
            })
            .catch(() => returnServerError(res));
        } else {
          res.status(404).send({
            message: 'invalid user'
          });
        }
      })
      .catch(error => res.status(400).send({
        message: error.message
      }));
  },

  /**
   * @function addUser
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  addUser: (req, res) => {
    Document
      .findById(req.params.documentId)
      .then((document) => {
        User
          .findById(req.userId)
          .then((user) => {
            document.addUser(user)
            .then(res.status(200).send({
              message: 'user added successfully'
            }));
          })
          .catch(() => returnServerError(res));
      })
      .catch(() => returnServerError(res));
  }
};

export default documentsController;
