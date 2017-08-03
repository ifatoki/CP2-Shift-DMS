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
        ownerId: req.body.ownerId,
        accessId: req.body.accessId
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
  fetchAll: (req, res) => {
    const query = {};
    switch (req.query.type) {
    case 'public':
      query.accessId = 2;
      break;
    case 'role':
    case 'shared':
      query.ownerId = req.query.userId;
      break;
    default:
      query.accessId = 1;
      query.ownerId = req.query.userId;
      break;
    }
    if (!query.accessId) {
      User
        .findById(req.query.userId)
        .then((user) => {
          if (req.query.type === 'role') {
            Role.findById(user.roleId)
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
  fetchOne: (req, res) => {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          res.status(404).send({
            message: 'document not found'
          });
        } else {
          const response = { document };
          if (document.ownerId === req.userId) {
            response.rightId = 1;
            res.status(200).send(response);
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
                  where: {
                    id: req.roleId
                  },
                  joinTableAttributes: ['rightId']
                })
                .then((role) => {
                  if (role.length < 1) {
                    res.status(401).send({
                      message: 'you are not authorized to access this document'
                    });
                  } else {
                    response.rightId =
                      role[0].dataValues.DocumentRole.dataValues.rightId;
                    res.status(200).send(response);
                  }
                })
                .catch(error => res.status(500).send(error));
              } else {
                response.rightId =
                  user[0].dataValues.DocumentUser.dataValues.rightId;
                res.status(200).send(response);
              }
            })
            .catch(error => res.status(400).send(error));
          }
        }
      })
      .catch(error => res.status(400).send(error));
  },
  fetchPublic: (req, res) => {
    Document
      .findAll({
        where: {
          accessId: 2
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
  update: (req, res) => {
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
  delete: (req, res) => {
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
                              .catch(error => res.status(400).send(error));
                          });
                      } else {
                        res.status(404).send({
                          message: 'role not found'
                        });
                      }
                    })
                    .catch(error => res.status(400).send(error));
                })
                .catch(error => res.status(500).send(error));
            })
            .catch(error => res.status(500).send(error));
        } else {
          res.status(404).send({
            message: 'invalid user'
          });
        }
      })
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
