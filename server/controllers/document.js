import Models from '../models';

const User = Models.User;
const Document = Models.Document;
const Role = Models.Role;

const documentController = {
  create: (req, res) => {
    Document
      .create({
        title: req.body.title,
        content: req.body.content,
        OwnerId: req.body.owner_id,
        AccessId: req.body.accessId
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
  fetch: (req, res) => {
    const query = {};
    switch (req.query.type) {
      case 'public':
        query.AccessId = 2;
        break;
      case 'role':
      case 'shared':
        query.OwnerId = req.query.userId;
        break;
      default:
        query.AccessId = 1;
        query.OwnerId = req.query.userId;
        break;
    }
    if (!query.AccessId) {
      User
        .findById(req.query.userId)
        .then((user) => {
          if (req.query.type === 'role') {
            Role.findById(user.RoleId)
            .then((role) => {
              role.getDocuments()
              .then((documents) => {
                res.status(200).send(documents);
              })
              .catch((error) => {
                res.status(400).send(error);
              });
            });
          } else {
            user.getDocuments()
            .then((documents) => {
              res.status(200).send(documents);
            })
            .catch((error) => {
              res.status(400).send(error);
            });
          }
        })
        .catch(error => res.status(400).send(error));
    } else {
      Document
        .findAndCountAll({
          where: query,
          limit: req.query.limit || null,
          offset: req.query.offset
        })
        .then(documents => res.status(200).send(documents.rows))
        .catch(error => res.status(400).send(error));
    }
  },
  fetchDocument: (req, res) => {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          res.status(404).send({
            message: 'document not found'
          });
        } else {
          res.status(200).send(document);
        }
      })
      .catch(error => res.status(400).send(error));
  },
  fetchPublicDocuments: (req, res) => {
    Document
      .findAll({
        where: {
          AccessId: 2
        }
      })
      .then((documents) => {
        if (!documents) {
          res.status(404).send({
            message: 'no public documents found'
          });
        } else {
          res.status(200).send(documents);
        }
      })
      .catch(error => res.status(400).send(error));
  },
  updateDocument: (req, res) => {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          res.status(404).send({
            message: 'document not found'
          });
        } else {
          document.update({
            title: req.body.title || document.title,
            content: req.body.content || document.content,
          })
          .then(updatedDocument => res.status(200).send(updatedDocument))
          .catch(error => res.status(400).send(error));
        }
      })
      .catch(error => res.status(400).send(error));
  },
  deleteDocument: (req, res) => {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          res.status(404).send({
            message: 'document not found'
          });
        } else {
          document.destroy({
            cascade: true
          })
          .then(() => res.status(200).send({
            message: 'document deleted successfully'
          }))
          .catch(error => res.status(400).send(error));
        }
      });
  },
  search: (req, res) => {
    Document
      .findAll({
        where: {
          title: {
            $ilike: `${req.query.q}%`
          }
        }
      })
      .then(user => res.status(200).send(user))
      .catch(error => res.status(400).send(error));
  },
  addUser: (req, res) => {
    Document
      .findById(req.params.documentId)
      .then((document) => {
        User
          .findById(req.query.userId)
          .then((user) => {
            document.addUser(user)
            .then(res.status(200).send({
              message: 'user added successfully'
            }));
          })
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  }
};

module.exports = documentController;
