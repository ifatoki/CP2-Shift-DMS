import Models from '../models';

const User = Models.User;
const Document = Models.Document;
const Role = Models.Role;

const filterDocument = document => ({
  id: document.id,
  title: document.title,
  content: document.content,
  updatedAt: document.updatedAt,
  ownerId: document.ownerId,
  accessId: document.accessId
});

const updateDocument = (document, req, res) => {
  document.update({
    title: req.body.title || document.title,
    content: req.body.content || document.content,
  })
  .then((updatedDocument) => {
    res.status(200).send({
      document: filterDocument(updatedDocument)
    });
  })
  .catch(error => res.status(500).send({
    message: error.message
  }));
};

const deleteDocument = (document, req, res) => {
  document.destroy({
    cascade: true
  })
  .then(() => res.status(200).send({
    message: 'document deleted successfully'
  }))
  .catch(error => res.status(500).send({
    message: error.message
  }));
};

const documentController = {
  create: (req, res) => {
    Document
      .findOne({
        where: {
          title: req.body.title
        }
      })
      .then((document) => {
        if (document) {
          res.status(403).send({
            message: 'a document with that title already exists'
          });
        } else {
          Document
            .create({
              title: req.body.title,
              content: req.body.content,
              ownerId: req.userId,
              accessId: req.body.accessId
            })
            .then((newDocument) => {
              res.status(201).send({
                document: filterDocument(newDocument)
              });
            })
            .catch((error) => {
              res.status(500).send({
                message: error.message
              });
            });
        }
      })
      .catch(error => res.status(500).send({
        message: error.message
      }));
  },
  fetchAll: (req, res) => {
    const query = {};
    switch (req.query.type) {
    case 'public':
      query.accessId = 2;
      break;
    case 'role':
    case 'shared':
      query.ownerId = req.userId;
      break;
    default:
      query.accessId = 1;
      query.ownerId = req.userId;
      break;
    }
    if (!query.accessId) {
      User
        .findById(req.userId)
        .then((user) => {
          if (req.query.type === 'role') {
            Role.findById(user.roleId)
            .then((role) => {
              role.getDocuments()
              .then((documents) => {
                res.status(200).send({ documents });
              })
              .catch((error) => {
                res.status(500).send({
                  message: error.message
                });
              });
            });
          } else {
            user.getDocuments()
            .then((documents) => {
              res.status(200).send({ documents });
            })
            .catch((error) => {
              res.status(500).send({
                message: error.message
              });
            });
          }
        })
        .catch(error => res.status(500).send({
          message: error.message
        }));
    } else {
      Document
        .findAndCountAll({
          where: query,
          limit: req.query.limit || null,
          offset: req.query.offset
        })
        .then(documents => res.status(200).send({
          documents: documents.rows
        }))
        .catch(error => res.status(400).send({
          message: error.message
        }));
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
          const response = { document: filterDocument(document) };
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
                .catch(error => res.status(500).send({
                  message: error.message
                }));
              } else {
                response.rightId =
                  user[0].dataValues.DocumentUser.dataValues.rightId;
                res.status(200).send(response);
              }
            })
            .catch(error => res.status(500).send({
              message: error.message
            }));
          }
        }
      })
      .catch(error => res.status(400).send({
        message: error.message
      }));
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
          Document
            .findOne({
              where: {
                title: req.body.title,
                id: {
                  $ne: document.id
                }
              }
            })
            .then((duplicateDocument) => {
              if (duplicateDocument) {
                res.status(403).send({
                  message: 'a document with that title already exists'
                });
              } else if (document.ownerId === req.userId) {
                updateDocument(document, req, res);
              } else if (document.accessId === 2) {
                res.status(403).send({
                  message: "you don't have the rights to edit this document"
                });
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
                          message:
                            'you are not authorized to access this document'
                        });
                      } else if (
                        role[0].dataValues.DocumentRole.dataValues.rightId < 3
                      ) {
                        updateDocument(document, req, res);
                      } else {
                        res.status(403).send({
                          message:
                            "you don't have the rights to edit this document"
                        });
                      }
                    })
                    .catch(error => res.status(500).send({
                      message: error.message
                    }));
                  } else if (
                    user[0].dataValues.DocumentUser.dataValues.rightId < 3
                  ) {
                    updateDocument(document, req, res);
                  } else {
                    res.status(403).send({
                      message:
                        "you don't have the rights to edit this document"
                    });
                  }
                })
                .catch(error => res.status(400).send({
                  message: error.message
                }));
              }
            })
            .catch(error => res.status(500).send({
              message: error.message
            }));
        }
      })
      .catch(error => res.status(500).send({
        message: error.message
      }));
  },
  delete: (req, res) => {
    Document
      .findById(req.params.id)
      .then((document) => {
        if (!document) {
          res.status(404).send({
            message: 'document not found'
          });
        } else if (document.ownerId === req.userId) {
          deleteDocument(document, req, res);
        } else if (document.accessId === 2) {
          if (req.roleId === 1) {
            deleteDocument(document, req, res);
          } else {
            res.status(403).send({
              message: "you don't have the rights to delete this document"
            });
          }
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
                    message:
                      'you are not authorized to access this document'
                  });
                } else if (
                  role[0].dataValues.DocumentRole.dataValues.rightId === 1
                ) {
                  deleteDocument(document, req, res);
                } else {
                  res.status(403).send({
                    message:
                      "you don't have the rights to delete this document"
                  });
                }
              })
              .catch(error => res.status(500).send({
                message: error.message
              }));
            } else if (
              user[0].dataValues.DocumentUser.dataValues.rightId === 1
            ) {
              deleteDocument(document, req, res);
            } else {
              res.status(403).send({
                message:
                  "you don't have the rights to delete this document"
              });
            }
          })
          .catch(error => res.status(500).send({
            message: error.message
          }));
        }
      })
      .catch(error => res.status(500).send({
        message: error.message
      }));
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
                              .catch(error => res.status(500).send({
                                message: error.message
                              }));
                          });
                      } else {
                        res.status(404).send({
                          message: 'role not found'
                        });
                      }
                    })
                    .catch(error => res.status(400).send({
                      message: error.message
                    }));
                })
                .catch(error => res.status(500).send({
                  message: error.message
                }));
            })
            .catch(error => res.status(500).send({
              message: error.message
            }));
        } else {
          res.status(404).send({
            message: 'invalid user'
          });
        }
      })
      .catch(error => res.status(400).send({
        message: error.message
      }));
  },
  addUser: (req, res) => {
    Document
      .findById(req.params.documentId)
      .then((document) => {
        User
          .findById(req.userId)
          .then((user) => {
            document.addUser(user)
            .then(res.status(200).send({
              message: 'user added successfully'
            }));
          })
          .catch(error => res.status(500).send({
            message: error.message
          }));
      })
      .catch(error => res.status(500).send({
        message: error.message
      }));
  }
};

module.exports = documentController;
