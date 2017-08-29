import { Right, DocumentRole } from '../models';

/**
 * Returns a 500 server error with the server response
 * @function returnServerError
 *
 * @param {Object} res - Server Response Object
 * @returns {void}
 */
const returnServerError = res => (
  res.status(500).send({
    message: 'oops, we just encountered an error. please try again'
  })
);

const rightsController = {
  /**
   * Create a new right with the passed data
   * @function create
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
   * @returns {void}
   */
  create(req, res) {
    if (req.body.title !== '') {
      Right
        .findOne({
          where: {
            title: req.body.title
          }
        })
        .then((right) => {
          if (!right) {
            Right
              .create({
                title: req.body.title,
                description: req.body.description
              })
              .then(newRight => res.status(201).send({
                right: newRight
              }))
              .catch(() => returnServerError());
          } else {
            res.status(403).send({
              message: 'right already exists'
            });
          }
        })
        .catch(() => returnServerError(res));
    } else {
      res.status(400).send({
        message: 'blank title'
      });
    }
  },

  /**
   * Fetch and return all rights.
   * @function list
   *
   * @param {Object} req - Server Request Object
   * @param {Object} res - Server Response Object
   * @returns {void}
   */
  list(req, res) {
    return Right
      .findAll({
        include: [DocumentRole]
      })
      .then(rights => res.status(200).send({
        rights
      }))
      .catch(() => returnServerError(res));
  }
};

export default rightsController;
