import moxios from 'moxios';
import thunk from 'redux-thunk';
import faker from 'faker';
import _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import ActionTypes from '../../actions/ActionTypes';
import DocumentActions from '../../actions/DocumentActions';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Document Actions', () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  const document = {
    id: 1,
    title: faker.company.catchPhrase(),
    content: faker.lorem.paragraph(2),
    accessId: 2
  };
  const errorDocument = {
    id: 1,
    accessId: 3
  };

  describe('Create Document Action', () => {
    it('creates documents', (done) => {
      moxios.stubRequest('api/v1/documents', {
        status: 201,
        response: {
          document
        }
      });
      const store = mockStore({});
      store.dispatch(DocumentActions.saveNewDocument(document))
      .then(() => {
        expect(store.getActions()[0].type)
          .toEqual(ActionTypes.DOCUMENT_SAVE_REQUEST);
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.DOCUMENT_SAVE_SUCCESSFUL);
        expect(store.getActions()[1].payload)
          .toEqual(document);
      });
      done();
    });

    it('dispatch error action if theres any error', () => {
      moxios.stubRequest('api/v1/documents', {
        status: 400,
        response: {
          message: 'title is required<br/>'
        }
      });

      const store = mockStore({});
      store.dispatch(DocumentActions.saveNewDocument(errorDocument));
      expect(store.getActions()[1].type)
        .toEqual(ActionTypes.DOCUMENT_SAVE_FAILED);
      expect(store.getActions()[1].payload)
        .toEqual('title is required<br/>');
    });
  });

  describe('fetch all documents action', () => {
    const documents = _.map([1, 2, 3], (id) => {
      return {
        id,
        title: faker.company.catchPhrase(),
        content: faker.lorem.paragraph(2)
      };
    });
    it('fetches documents', (done) => {
      moxios.stubRequest('api/v1/documents', {
        status: 200,
        response: {
          documents
        }
      });

      const store = mockStore({});
      store.dispatch(DocumentActions.fetchDocuments())
      .then(() => {
        expect(store.getActions()[1].type)
        .toEqual(ActionTypes.DOCUMENTS_FETCH_SUCCESSFUL);
        expect(store.getActions()[1].payload).toEqual(
          documents
        );
      });
      done();
    });
  });

  describe('get single document', () => {
    it('gets a single document from db', (done) => {
      moxios.stubRequest(`api/v1/documents/${document.id}`, {
        status: 200,
        response: { document }
      });

      const store = mockStore({});
      store.dispatch(DocumentActions.getDocument(document.id))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.DOCUMENT_GET_SUCCESSFUL);
        expect(store.getActions()[1].payload.document).toEqual(
          document
        );
      });
      done();
    });

    it('dispatch error action if theres any error', (done) => {
      moxios.stubRequest('api/documents/3000000', {
        status: 404,
        response: {
          message: 'document not found'
        }
      });
      const store = mockStore({});
      store.dispatch(DocumentActions.getDocument(3000000))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.DOCUMENT_GET_FAILED);
        expect(store.getActions()[1].payload).toEqual({
          message: 'Document not found'
        });
      });
      done();
    });
  });

  describe('Update Documents', () => {
    it('dispatch error action if theres any error', (done) => {
      moxios.stubRequest(`api/v1/documents/${document.id}`, {
        status: 200,
        response: {
          document
        }
      });

      const store = mockStore({});
      store.dispatch(DocumentActions.modifyDocument(document.id, document))
      .then(() => {
        expect(store.getActions()[0].type)
          .toEqual(ActionTypes.DOCUMENT_MODIFY_REQUEST);
        expect(store.getActions()[1].payload)
          .toEqual(document);
      });
      done();
    });

    it('dispatch error action if theres any error', (done) => {
      moxios.stubRequest('api/v1/documents/3000000', {
        status: 404,
        response: {
          message: 'document not found'
        }
      });
      const store = mockStore({});
      store.dispatch(DocumentActions.modifyDocument(3000000, errorDocument))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.DOCUMENT_MODIFY_FAILED);
        expect(store.getActions()[1].payload).toEqual(
          'document not found'
        );
      });
      done();
    });
  });

  describe('Delete Documents', () => {
    it('deletes a single document', (done) => {
      moxios.stubRequest('api/v1/documents/1', {
        status: 200,
        response: {
          message: 'document deleted successfully'
        }
      });

      const store = mockStore({});
      store.dispatch(DocumentActions.deleteDocument(1))
      .then(() => {
        expect(store.getActions()[1].type)
        .toEqual(ActionTypes.DOCUMENT_DELETE_SUCCESSFUL);
        expect(store.getActions()[1].payload).toEqual(
          'document deleted successfully'
        );
      });
      done();
    });

    it('dispatch error action if theres any error', (done) => {
      moxios.stubRequest('api/documents/3000000', {
        status: 404,
        response: {
          message: 'document not found'
        }
      });
      const store = mockStore({});
      store.dispatch(DocumentActions.deleteDocument(3000000, errorDocument))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(ActionTypes.DOCUMENT_DELETE_FAILED);
        expect(store.getActions()[1].payload).toEqual({
          message: 'document not found'
        });
      });
      done();
    });
  });

  describe('Search documents', () => {
    it('returns data if matching documents are found', (done) => {
      moxios.stubRequest('api/v1/search/documents?q=hello', {
        status: 200,
        response: {
          documents: [{
            id: 1,
            title: 'Hello World',
            content: 'Hi dear'
          }]
        }
      });

      const store = mockStore({});
      store.dispatch(DocumentActions.searchDocuments('hello'))
      .then(() => {
        expect(store.getActions()[1].type)
        .toEqual(ActionTypes.DOCUMENTS_SEARCH_SUCCESSFUL);
        expect(store.getActions()[1].payload.documents).toEqual([{
          id: 1,
          title: 'Hello World',
          content: 'Hi dear'
        }]);
      });
      done();
    });
  });
});
