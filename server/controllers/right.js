const Right = require('../models').Right;
const DocumentRole = require('../models').DocumentRole;

module.exports = {
  create(req, res) {
    return Right
      .create({
        title: req.body.title,
        description: req.body.description
      })
      .then(right => res.status(201).send(right))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return Right
      .findAll({
        include: [DocumentRole]
      })
      .then(rights => res.status(201).send(rights))
      .catch(error => res.status(400).send(error));
  }
};
