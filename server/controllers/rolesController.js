import { Role } from '../models';

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
 * Filter the role, displaying only necessary data
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

const rolesController = {
  /**
   * Create a new role using the passed data
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
        .catch(() => returnServerError(res));
    } else {
      res.status(401).send({
        message: 'you are not authorized to create new roles'
      });
    }
  },

  /**
   * List out all available roles
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
      .catch(() => returnServerError(res));
  }
};

export default rolesController;
