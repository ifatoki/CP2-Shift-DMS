import faker from 'faker';

const homeProps = {
  user: {
    isAuthenticated: false,
    id: 1,
    email: faker.internet.email(),
    username: faker.internet.userName(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    result: '',
    role: 'user',
    userUpdateSuccessful: false
  },
  documentsCount: 0,
  currentDocumentUpdated: false,
  currentDocumentModified: false,
  currentUserUpdated: false,
  documentsUpdated: false,
  documentSaved: false,
  savingDocument: false,
  currentDocumentModifying: false,
  documentDeleted: false,
  documentDeleting: false,
  userDeleted: false,
  userDeleting: false,
  documentsType: '',
  currentDocumentErrorMessage: ''
};

export default homeProps;
