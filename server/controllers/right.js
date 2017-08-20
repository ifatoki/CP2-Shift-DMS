const Right = require('../models').Right;
const DocumentRole = require('../models').DocumentRole;

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
              .catch(error => res.status(400).send({
                message: error.message
              }));
          } else {
            res.status(403).send({
              message: 'right already exists'
            });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message
          });
        });
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
      .catch(error => res.status(400).send({
        message: error.message
      }));
  }
};
