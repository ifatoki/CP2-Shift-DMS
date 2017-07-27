const Right = require('../models').Right;
const DocumentRole = require('../models').DocumentRole;

module.exports = {
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
              .then(newRight => res.status(201).send(newRight))
              .catch(error => res.status(400).send(error));
          } else {
            res.status(400).send({
              message: 'already exists'
            });
          }
        })
        .catch((err) => {
          res.status(500).json({
            status: 'error',
            message: err.message
          });
        });
    } else {
      res.status(400).send({
        message: 'blank title'
      });
    }
  },
  list(req, res) {
    return Right
      .findAll({
        include: [DocumentRole]
      })
      .then(rights => res.status(200).send(rights))
      .catch(error => res.status(400).send(error));
  }
};
