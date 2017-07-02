const Role = require('../models').Role;
const User = require('../models').User;

module.exports = {
  create: (req, res) => {
    Role
      .create({
        title: req.body.title,
        description: req.body.description
      })
      .then(role => res.status(201).send(role))
      .catch(error => res.status(400).send(error));
  },
  list: (req, res) => {
    Role
      .findAll({
        include: [{
          model: User,
        }],
      })
      .then(roles => res.status(200).send(roles))
      .catch(error => res.status(400).send(error));
  }
};
