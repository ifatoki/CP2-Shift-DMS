import _ from 'lodash';
import faker from 'faker';
import documents from '../../reducers/documents';
import ActionTypes from '../../actions/ActionTypes';
import { documentsDefaultState } from '../../reducers/initialStates';

describe('Documents Reducer', () => {
  describe('fetch documents', () => {
    const fetchedDocuments = _.map([1, 2, 3, 4], id => ({
      id,
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(2)
    }));

    it('should reset the error message and initialize documents updating',
    () => {
      const action = {
        type: ActionTypes.DOCUMENTS_FETCH_REQUEST,
      };
      const state = {
        ...documentsDefaultState,
        documentsUpdating: false,
        currentDocumentErrorMessage: 'error'
      };
      const newState = documents(state, action);

      expect(newState.documentsUpdating).toBeTruthy();
      expect(newState.currentDocumentErrorMessage).toEqual('');
    });
    it('should set the documents fetched and reset documentsUpdating to false',
    () => {
      const action = {
        type: ActionTypes.DOCUMENTS_FETCH_SUCCESSFUL,
        payload: {
          documents: fetchedDocuments,
          count: 700
        }
      };
      const state = {
        documentsUpdating: true,
        documentsUpdated: false,
        documents: []
      };
      const newState = documents(state, action);

      expect(newState.documentsUpdating).toBeFalsy();
      expect(newState.documentsUpdated).toBeTruthy();
      expect(newState.documents).toEqual(action.payload.documents);
      expect(newState.documentsCount).toEqual(action.payload.count);
    });
    it('should set the error message and reset documentsUpdating to false',
    () => {
      const action = {
        type: ActionTypes.DOCUMENTS_FETCH_FAILED,
        payload: 'you have no rights to access documents'
      };
      const state = {
        documentsUpdating: true,
        documentsUpdated: false,
        currentDocumentErrorMessage: ''
      };
      const newState = documents(state, action);

      expect(newState.documentsUpdating).toBeFalsy();
      expect(newState.documentsUpdated).toBeFalsy();
      expect(newState.currentDocumentErrorMessage).toEqual(action.payload);
    });
  });

  describe('modify document', () => {
    const document = {
      id: 4,
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(2),
    };

    it('should reset the error message and initialize currentDocumentModifying',
    () => {
      const action = {
        type: ActionTypes.DOCUMENT_MODIFY_REQUEST,
      };
      const state = {
        currentDocumentModifying: false,
        currentDocumentErrorMessage: 'error'
      };
      const newState = documents(state, action);

      expect(newState.currentDocumentModifying).toBeTruthy();
      expect(newState.currentDocumentErrorMessage).toEqual('');
    });
    it(`should set the document saved to currentDocument and reset 
    currentDocumentModifying to false`, () => {
      const action = {
        type: ActionTypes.DOCUMENT_MODIFY_SUCCESSFUL,
        payload: document
      };
      const state = {
        currentDocumentModifying: true,
        currentDocumentModified: false,
        currentDocument: null
      };
      const newState = documents(state, action);

      expect(newState.currentDocumentModifying).toBeFalsy();
      expect(newState.currentDocumentModified).toBeTruthy();
      expect(newState.currentDocument).toEqual(document);
    });
    it(`should set the error message and reset currentDocumentModifying
    to false`, () => {
      const action = {
        type: ActionTypes.DOCUMENT_MODIFY_FAILED,
        payload: 'document title is invalid'
      };
      const state = {
        currentDocumentModifying: true,
        currentDocumentModified: false,
        currentDocumentErrorMessage: ''
      };
      const newState = documents(state, action);

      expect(newState.currentDocumentModifying).toBeFalsy();
      expect(newState.currentDocumentModified).toBeFalsy();
      expect(newState.currentDocumentErrorMessage).toEqual(action.payload);
    });
  });
  describe('delete document', () => {
    it('should reset the error message and initialize documentDeleting',
    () => {
      const action = {
        type: ActionTypes.DOCUMENT_DELETE_REQUEST,
      };
      const state = {
        documentDeleting: false,
        currentDocumentErrorMessage: 'error'
      };
      const newState = documents(state, action);

      expect(newState.documentDeleting).toBeTruthy();
      expect(newState.currentDocumentErrorMessage).toEqual('');
    });
    it(`should set the document saved to currentDocument and reset
    documentDeleting to false`, () => {
      const action = {
        type: ActionTypes.DOCUMENT_DELETE_SUCCESSFUL
      };
      const state = {
        documentDeleting: true,
        documentDeleted: false
      };
      const newState = documents(state, action);

      expect(newState.documentDeleting).toBeFalsy();
      expect(newState.documentDeleted).toBeTruthy();
    });
    it('should set the error message and reset documentDeleting to false',
    () => {
      const action = {
        type: ActionTypes.DOCUMENT_DELETE_FAILED,
        payload: 'document delete failed'
      };
      const state = {
        documentDeleting: true,
        documentDeleted: false,
        currentDocumentErrorMessage: ''
      };
      const newState = documents(state, action);

      expect(newState.documentDeleting).toBeFalsy();
      expect(newState.documentDeleted).toBeFalsy();
      expect(newState.currentDocumentErrorMessage).toEqual(action.payload);
    });
  });

  describe('save document', () => {
    const document = {
      id: 4,
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(2),
    };

    it('should reset the error message and initialize savingDocument',
    () => {
      const action = {
        type: ActionTypes.DOCUMENT_SAVE_REQUEST,
      };
      const state = {
        savingDocument: false,
        currentDocumentErrorMessage: 'error'
      };
      const newState = documents(state, action);

      expect(newState.savingDocument).toBeTruthy();
      expect(newState.currentDocumentErrorMessage).toEqual('');
    });
    it(`should set the document saved to currentDocument and reset
    savingDocument to false`, () => {
      const action = {
        type: ActionTypes.DOCUMENT_SAVE_SUCCESSFUL,
        payload: {
          document,
          rightId: 1
        }
      };
      const state = {
        savingDocument: true,
        documentSaved: false,
        currentDocument: null
      };
      const newState = documents(state, action);

      expect(newState.savingDocument).toBeFalsy();
      expect(newState.documentSaved).toBeTruthy();
      expect(newState.currentDocument).toEqual(action.payload);
    });
    it('should set the error message and reset savingDocument to false',
    () => {
      const action = {
        type: ActionTypes.DOCUMENT_SAVE_FAILED,
        payload: 'document title is invalid'
      };
      const state = {
        savingDocument: true,
        documentSaved: false,
        currentDocumentErrorMessage: ''
      };
      const newState = documents(state, action);

      expect(newState.savingDocument).toBeFalsy();
      expect(newState.documentSaved).toBeFalsy();
      expect(newState.currentDocumentErrorMessage).toEqual(action.payload);
    });
  });
  describe('get document', () => {
    const document = {
      id: 4,
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(2),
    };

    it('should reset the error message and initialize currentDocumentUpdating',
    () => {
      const action = {
        type: ActionTypes.DOCUMENT_GET_REQUEST,
      };
      const state = {
        currentDocumentUpdating: false,
        currentDocumentErrorMessage: 'error'
      };
      const newState = documents(state, action);

      expect(newState.currentDocumentUpdating).toBeTruthy();
      expect(newState.currentDocumentErrorMessage).toEqual('');
    });
    it(`should set the document saved to currentDocument and reset
    currentDocumentUpdating to false`, () => {
      const action = {
        type: ActionTypes.DOCUMENT_GET_SUCCESSFUL,
        payload: {
          document,
          rightId: 1
        }
      };
      const state = {
        currentDocumentUpdating: true,
        currentDocumentUpdated: false,
        currentDocument: null
      };
      const newState = documents(state, action);

      expect(newState.currentDocumentUpdating).toBeFalsy();
      expect(newState.currentDocumentUpdated).toBeTruthy();
      expect(newState.currentDocument).toEqual(action.payload.document);
    });
    it(`should set the error message and reset currentDocumentUpdating
    to false`, () => {
      const action = {
        type: ActionTypes.DOCUMENT_GET_FAILED,
        payload: 'document title is invalid'
      };
      const state = {
        currentDocumentUpdating: true,
        currentDocumentUpdated: false,
        currentDocumentErrorMessage: ''
      };
      const newState = documents(state, action);

      expect(newState.currentDocumentUpdating).toBeFalsy();
      expect(newState.currentDocumentUpdated).toBeFalsy();
      expect(newState.currentDocumentErrorMessage).toEqual(action.payload);
    });
  });
  describe('search document', () => {
    const searchedDocuments = _.map([1, 2, 3, 4], id => ({
      id,
      title: faker.company.catchPhrase(),
      content: faker.lorem.paragraph(2),
    }));

    it(`should reset the error message and initialize
    documentsSearchResultUpdating`, () => {
      const action = {
        type: ActionTypes.DOCUMENTS_SEARCH_REQUEST,
      };
      const state = {
        documentsSearchResultUpdating: false,
        currentDocumentErrorMessage: 'error'
      };
      const newState = documents(state, action);

      expect(newState.documentsSearchResultUpdating).toBeTruthy();
      expect(newState.currentDocumentErrorMessage).toEqual('');
    });
    it(`should set the document saved to currentDocument and reset
    documentsSearchResultUpdating to false`, () => {
      const action = {
        type: ActionTypes.DOCUMENTS_SEARCH_SUCCESSFUL,
        payload: {
          searchedDocuments
        }
      };
      const state = {
        documentsSearchResultUpdating: true,
        currentDocumentUpdated: false,
        currentDocument: null
      };
      const newState = documents(state, action);

      expect(newState.documentsSearchResultUpdating).toBeFalsy();
      expect(newState.documentsSearchResultUpdated).toBeTruthy();
    });
    it(`should set the error message and reset documentsSearchResultUpdating
    to false`, () => {
      const action = {
        type: ActionTypes.DOCUMENTS_SEARCH_FAILED,
        payload: 'search failed'
      };
      const state = {
        documentsSearchResultUpdating: true,
        currentDocumentUpdated: false,
        currentDocumentErrorMessage: ''
      };
      const newState = documents(state, action);

      expect(newState.documentsSearchResultUpdating).toBeFalsy();
      expect(newState.documentsSearchResultUpdated).toBeFalsy();
      expect(newState.currentDocumentErrorMessage).toEqual(action.payload);
    });
  });
  describe('document cancel', () => {
    it('should set the error message and reset document state', () => {
      const action = {
        type: ActionTypes.DOCUMENT_CANCELLED,
        payload: 'search failed'
      };
      const state = {
        currentDocumentUpdated: false,
        documentsUpdated: false,
        documentSaved: false,
        currentDocumentModified: false,
        currentDocumentErrorMessage: ''
      };
      const newState = documents(state, action);

      expect(newState.currentDocumentUpdated).toBeFalsy();
      expect(newState.documentsUpdated).toBeFalsy();
      expect(newState.documentSaved).toBeFalsy();
      expect(newState.currentDocumentModified).toBeFalsy();
      expect(newState.currentDocumentErrorMessage).toBeFalsy();
    });
  });
  describe('default action', () => {
    it('return the state as it is', () => {
      const action = {
        type: ActionTypes.DOCUMENT_DOCUMENT_DEFAULT
      };
      const state = {
        currentDocumentUpdated: false,
        documentsUpdated: false,
        documentSaved: false,
        currentDocumentModified: false,
        currentDocumentErrorMessage: ''
      };
      const newState = documents(state, action);

      expect(newState).toEqual(state);
    });
  });
});
