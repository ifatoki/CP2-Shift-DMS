const Right = require('../models').Right;
const DocumentRole = require('../models').DocumentRole;

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

module.exports = {
  /**
   * @function create
   *
   * @param {any} req
   * @param {any} res
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
              .catch(returnServerError());
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
   * @function list
   *
   * @param {any} req
   * @param {any} res
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
