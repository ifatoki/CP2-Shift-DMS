const chai = require('chai');
// const chaiHttp = require('chai-http');

const expect = chai.expect;
const models = require('../models');
const controllers = require('../controllers');
const testdata = require('./testdata');

// chai.use(chaiHttp);

describe('Models,', () => {
  before(
    () => models.sequelize.sync()
  );

  describe('Rights functions', () => {
    const Right = models.Right;
    const rightsController = controllers.rights;

    beforeEach(() => {
      Right.destroy({
        where: {}
      });
    });

    describe('create', () => {
      it('should create a new Right entry', () => {
        Right.create(testdata.rights.right1)
          .then((right) => {
            expect(right.title)
              .to.equal(testdata.rights.right1.title);
            expect(right.description)
              .to.equal(testdata.rights.right1.description);
          });
      });

      // it('should create a new Right entry using controllers', () => {
      //   let req = {};
      //   let res = {};

      //   req.body = testdata.rights.right1;
      //   rightsController.create(req, res);
      // });
    });

    // describe('')
  });
  // beforeEach(() => {
  //   Document = models.Document;
  //   Document.destroy({
  //     where: {},
  //     truncate: true
  //   });
  // });

  describe('Trial pass', () => {
    it('should equal 5', () => {
      expect(2 + 3).to.equal(5);
    });
  });
});

// describe('Documents model functions, ', () => {
//   before(
//     () => models.sequelize.sync()
//   );bar

//   beforeEach(() => {
//     Document = models.Document;
//     Document.destroy({
//       where: {},
//       truncate: true
//     });
//   });

//   const documents = {
//     doc1: {
//       title: 'The best book I never wrote',
//       content: 'Talks about the life and times of the greatest politician',
//       OwnerId: 6
//     },
//     doc2: {
//       title: 'The travails of a Nigerian child',
//       content: 'Simply stunning and astounding',
//       OwnerId: 6
//     },
//   };

//   it('it creates a new Document', () => {
//     expect(
//       Document.create(documents.doc1)
//     ).to.fail();
//       // .then((document) => {
//       //   document.title.should.equal(documents.doc1.title);
//       //   document.content.should.equal(documents.doc1.content);
//       // });
//   });

//   describe('Trial pass', () => {
//     it('should equal 5', () => {
//       expect(2 + 3).to.equal(5);
//     });
//   });
// });
