import moxios from 'moxios';
import thunk from 'redux-thunk';
import faker from 'faker';
import lodash from 'lodash';
import configureMockStore from 'redux-mock-store';
import actionTypes from '../../actions/actionTypes';
import documentActions from '../../actions/documentActions';

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
      store.dispatch(documentActions.saveNewDocument(document))
      .then(() => {
        expect(store.getActions()[0].type)
          .toEqual(actionTypes.DOCUMENT_SAVE_REQUEST);
        expect(store.getActions()[1].type)
          .toEqual(actionTypes.DOCUMENT_SAVE_SUCCESSFUL);
        expect(store.getActions()[1].payload)
          .toEqual(document);
      });
      done();
    });

    it('dispatches error action when errors occur', () => {
      moxios.stubRequest('api/v1/documents', {
        status: 400,
        response: {
          message: 'title is required<br/>'
        }
      });

      const store = mockStore({});
      store.dispatch(documentActions.saveNewDocument(errorDocument));
      expect(store.getActions()[1].type)
        .toEqual(actionTypes.DOCUMENT_SAVE_FAILED);
      expect(store.getActions()[1].payload)
        .toEqual('title is required<br/>');
    });
  });

  describe('fetch all documents action', () => {
    const documents = lodash.map([1, 2, 3], id => ({
      id,
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(2)
    }));
    it('fetches documents and returns', (done) => {
      moxios.stubRequest('api/v1/documents', {
        status: 200,
        response: {
          documents
        }
      });

      const store = mockStore({});
      store.dispatch(documentActions.fetchDocuments())
      .then(() => {
        expect(store.getActions()[1].type)
        .toEqual(actionTypes.DOCUMENTS_FETCH_SUCCESSFUL);
        expect(store.getActions()[1].payload).toEqual(
          documents
        );
      });
      done();
    });
  });

  describe('get single document', () => {
    it('gets the requested document from the database', (done) => {
      moxios.stubRequest(`api/v1/documents/${document.id}`, {
        status: 200,
        response: { document }
      });

      const store = mockStore({});
      store.dispatch(documentActions.getDocument(document.id))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(actionTypes.DOCUMENT_GET_SUCCESSFUL);
        expect(store.getActions()[1].payload.document).toEqual(
          document
        );
      });
      done();
    });

    it('dispatch error when incvalid document is requested', (done) => {
      moxios.stubRequest('api/v1/documents/3000000', {
        status: 404,
        response: {
          message: 'document not found'
        }
      });
      const store = mockStore({});
      store.dispatch(documentActions.getDocument(3000000))
      .catch(() => {
        expect(store.getActions()[1].type)
          .toEqual(actionTypes.DOCUMENT_GET_FAILED);
        expect(store.getActions()[1].payload).toEqual({
          message: 'Document not found'
        });
      });
      done();
    });
  });

  describe('Update Documents', () => {
    it('modifies and return modified document on success', (done) => {
      moxios.stubRequest(`api/v1/documents/${document.id}`, {
        status: 200,
        response: {
          document
        }
      });

      const store = mockStore({});
      store.dispatch(documentActions.modifyDocument(document.id, document))
      .then(() => {
        expect(store.getActions()[0].type)
          .toEqual(actionTypes.DOCUMENT_MODIFY_REQUEST);
        expect(store.getActions()[1].payload)
          .toEqual(document);
      });
      done();
    });

    it('dispatches error for invalid document', (done) => {
      moxios.stubRequest('api/v1/documents/3000000', {
        status: 404,
        response: {
          message: 'document not found'
        }
      });
      const store = mockStore({});
      store.dispatch(documentActions.modifyDocument(3000000, errorDocument))
      .then(() => {
        expect(store.getActions()[1].type)
          .toEqual(actionTypes.DOCUMENT_MODIFY_FAILED);
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
      store.dispatch(documentActions.deleteDocument(1))
      .then(() => {
        expect(store.getActions()[1].type)
        .toEqual(actionTypes.DOCUMENT_DELETE_SUCCESSFUL);
        expect(store.getActions()[1].payload).toEqual(
          'document deleted successfully'
        );
      });
      done();
    });

    it('dispatches error for invalid documents', (done) => {
      moxios.stubRequest('api/v1/documents/3000000', {
        status: 404,
        response: {
          message: 'document not found'
        }
      });
      const store = mockStore({});
      store.dispatch(documentActions.deleteDocument('3000000', errorDocument))
      .catch(() => {
        expect(store.getActions()[1].type)
          .toEqual(actionTypes.DOCUMENT_DELETE_FAILED);
        expect(store.getActions()[1].payload).toEqual(
          'document not found'
        );
      });
      done();
    });
  });

  describe('Search documents', () => {
    it('returns matching documents', (done) => {
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
      store.dispatch(documentActions.searchDocuments('hello'))
      .then(() => {
        expect(store.getActions()[1].type)
        .toEqual(actionTypes.DOCUMENTS_SEARCH_SUCCESSFUL);
        expect(store.getActions()[1].payload.documents).toEqual([{
          id: 1,
          title: 'Hello World',
          content: 'Hi dear'
        }]);
      });
      done();
    });
  });

  it('cancels an ongoing document edit/view', () => {
    const store = mockStore({});
    store.dispatch(documentActions.cancelNewDocument());
    expect(store.getActions()[0].type)
    .toEqual(actionTypes.DOCUMENT_CANCELLED);
  });
});
