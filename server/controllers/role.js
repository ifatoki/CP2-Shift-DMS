const Role = require('../models').Role;

/**
 * @function filterRole
 *
 * @param {any} role
 * @returns {object} A filtered role
 */
const filterRole = role => ({
  id: role.id,
  description: role.description,
  title: role.title,
  createdAt: role.createdAt
});

module.exports = {
  /**
   * @function create
   *
   * @param {any} req
   * @param {any} res
   * @returns {void}
   */
  create: (req, res) => {
    if (req.userId === 1) {
      Role
        .create({
          title: req.body.title,
          description: req.body.description
        })
        .then(role => res.status(201).send({
          role: filterRole(role)
        }))
        .catch(error => res.status(400).send({
          message: error.message
        }));
    } else {
      res.status(401).send({
        message: 'you are not authorized to create new roles'
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
  list: (req, res) => {
    Role
      .findAll({
        where: {
          id: {
            $ne: 1
          }
        },
        attributes: ['id', 'title', 'description', 'createdAt']
      })
      .then((roles) => {
        res.status(200).send({
          roles
        });
      })
      .catch(error => res.status(400).send({
        message: error.message
      }));
  }
};
