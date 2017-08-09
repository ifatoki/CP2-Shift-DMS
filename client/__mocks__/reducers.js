import faker from 'faker';

const reducers = () => ({
  user: {
    isAuthenticated: false,
    users: [],
    roles: [],
    currentUser: {},
    currentUserUpdated: false,
    userDeleted: false,
    userDeleting: false,
    currentUserModifying: false,
    currentUserModified: false,
    currentUserErrorMessage: '',
    id: 1,
    email: faker.internet.email(),
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    result: '',
    role: 'user',
    userUpdateSuccessful: false
  },
  documents: {
    currentDocument: null,
    currentRightId: 3,
    documents: [],
    currentDocumentUpdated: false,
    currentDocumentModified: false,
    documentsUpdated: false,
    documentSaved: false,
    documentsSearchResult: {},
    documentsSearchResultUpdated: false,
    savingDocument: false,
    currentDocumentModifying: false,
    documentDeleting: false,
    documentDeleted: false,
    currentDocumentErrorMessage: ''
  }
});

export default reducers;
