const usersDefaultState = {
  isAuthenticated: false,
  users: [],
  roles: [],
  currentUser: {},
  currentUserUpdated: false,
  userDeleted: false,
  userDeleting: false,
  currentUserModifying: false,
  currentUserModified: false,
  currentUserErrorMessage: ''
};

const documentsDefaultState = {
  currentDocument: null,
  currentRightId: 3,
  currentDocumentRoles: [],
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
};

export { documentsDefaultState, usersDefaultState };
