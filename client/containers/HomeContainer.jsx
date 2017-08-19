import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react';
import toastr from 'toastr';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import UsersActions from '../actions/UsersActions';
import DocumentActions from '../actions/DocumentActions';
import DocumentList from '../components/DocumentList';
import SearchComponent from '../components/SearchComponent';
import UserList from '../components/UserList';
import DocumentManager from '../components/DocumentManager';
import UserManager from '../components/UserManager';

const {
  logUserOut,
  fetchAllUsers,
  fetchAllRoles,
  getUser
} = UsersActions;
const { fetchDocuments } = DocumentActions;

toastr.options = {
  positionClass: 'toast-top-center',
  showMethod: 'slideDown',
  timeOut: 2000
};

export class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'private',
      showUsers: false,
      createNewDocument: false,
    };
    this.logOut = this.logOut.bind(this);
    this.showUserProfile = this.showUserProfile.bind(this);
    this.initializeNewDocument = this.initializeNewDocument.bind(this);
    this.handleDocumentTypeChange = this.handleDocumentTypeChange.bind(this);
  }

  componentDidMount() {
    let type = 'private';

    if (this.props.user.id === 1) {
      type = 'public';
    }
    this.props.fetchDocuments(this.props.user.id, type);
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentDocumentUpdated,
      currentUserUpdated,
      documentSaved,
      documentsUpdated,
      currentDocumentModified,
      documentDeleted,
      userDeleted,
      currentDocumentErrorMessage
    } = nextProps;
    if (currentDocumentErrorMessage) {
      toastr.error(currentDocumentErrorMessage, 'Error');
    } else {
      if (this.props.documentDeleting) {
        if (documentDeleted) {
          toastr.success('Document Deleted', 'Success');
          this.props.fetchDocuments(this.props.user.id, this.state.type);
        }
      }
      if (this.props.userDeleting) {
        if (userDeleted) {
          toastr.success('User Deleted', 'Success');
          this.props.fetchAllUsers();
          this.props.fetchAllRoles();
        }
      }
      if (this.props.savingDocument || this.props.currentDocumentModifying) {
        if (documentSaved || currentDocumentModified) {
          toastr.success('Document Saved', 'Success');
          this.setState({
            createNewDocument: false
          }, () => {
            this.props.fetchDocuments(this.props.user.id, this.state.type);
          });
        }
      }
    }
    if (documentsUpdated) {
      this.setState({
        type: nextProps.documentsType
      });
    }
    if (currentDocumentUpdated) {
      $('.ui.document.modal')
        .modal({
          closable: false,
          detachable: false,
          observeChanges: true,
          selector: {
            close: '.cancel, .close'
          },
          onHide: () => {
            this.setState({
              createNewDocument: false,
              currentDocumentUpdated: false
            });
          },
          onShow: () => {
            $('.ui.document.modal').modal('refresh');
          }
        })
        .modal('show');
    } else if (currentUserUpdated) {
      $('.ui.user.modal')
        .modal({
          closable: false,
          detachable: false,
          observeChanges: true,
          selector: {
            close: '.cancel, .close'
          },
          onHide: () => {
            this.setState({
              currentUserUpdated: false
            });
          }
        })
        .modal('show');
    }
  }

  handleDocumentTypeChange(event) {
    event.preventDefault();
    toastr.info(`You are now viewing ${event.target.name} documents`);
    const newState = {
      type: event.target.name,
      showUsers: event.target.name === 'users'
    };
    this.setState(newState, () => {
      if (newState.type === 'users') {
        this.props.fetchAllUsers();
        this.props.fetchAllRoles();
      } else {
        this.props.fetchDocuments(this.props.user.id, this.state.type);
      }
    });
  }

  showUserProfile() {
    this.props.getUser(this.props.user.id);
  }

  initializeNewDocument() {
    this.setState({
      createNewDocument: true
    }, () => {
      $('.ui.document.modal')
        .modal({
          closable: false,
          detachable: false,
          observeChanges: true,
          selector: {
            close: '.cancel, .close'
          },
          onHide: () => {
            this.setState({
              createNewDocument: false
            });
          },
          onShow: () => {
            $('.ui.document.modal').modal('refresh');
          }
        })
        .modal('show');
    });
  }

  logOut(event) {
    event.preventDefault();
    this.props.logUserOut();
  }

  render() {
    const role = this.props.user.role.charAt(0).toUpperCase()
      + this.props.user.role.slice(1);
    return (
      <div
        className="homeContainer"
        style={{ height: '100%' }}
      >
        <DocumentManager
          createNew={this.state.createNewDocument}
        />
        <UserManager />
        <div className="ui large top fixed hidden secondary white menu">
          <div className="ui container">
            <div className="right menu">
              <i
                className="big icons"
                id="newDocument"
                style={{
                  margin: 'auto', cursor: 'pointer'
                }}
                role="button"
                name="newDocument"
                onClick={this.initializeNewDocument}
              >
                <i className="file text icon blue" />
                <i className="corner inverted add icon" />
              </i>
              <i
                id="userProfile"
                className="big icons"
                name="showUserProfile"
                style={{
                  margin: '10px', cursor: 'pointer'
                }}
                role="button"
                onClick={this.showUserProfile}
              >
                <i className="user circle outline blue icon" />
              </i>
              <Dropdown
                floating
                labeled
                button
                id="logoutModal"
                text={`@${this.props.user.username}`}
                style={{ margin: 'auto' }}
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    id="logout"
                    label={{ color: 'red', empty: true, circular: true }}
                    text="Logout"
                    onClick={this.logOut}
                  />
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div
          className="ui grid container"
          style={{
            paddingTop: '40px',
            marginTop: '0px',
            height: '100%'
          }}
        >
          <div className="three wide column fixed">
            <i className="dropbox huge blue icon" />
            <div className="ui divided items">
              <div
                className="item"
                style={{
                  display: this.props.user.role === 'overlord' ?
                  'none' : 'block'
                }}
              >
                <div className="middle aligned content">
                  <a
                    className="item"
                    name="private"
                    onClick={this.handleDocumentTypeChange}
                  >
                    Private Documents
                  </a>
                </div>
              </div>
              <div className="item">
                <div className="middle aligned content">
                  <a
                    className="item"
                    name="public"
                    onClick={this.handleDocumentTypeChange}
                  >
                    Public Documents
                  </a>
                </div>
              </div>
              <div
                className="item"
                style={{
                  display: this.props.user.role === 'overlord' ?
                  'none' : 'block'
                }}
              >
                <div className="middle aligned content">
                  <a
                    className="item"
                    name="role"
                    onClick={this.handleDocumentTypeChange}
                  >
                    {role} Documents
                  </a>
                </div>
              </div>
              <div
                className="item"
                style={{
                  display: this.props.user.role === 'overlord' ?
                  'block' : 'none'
                }}
              >
                <div className="middle aligned content">
                  <a
                    className="item"
                    name="users"
                    onClick={this.handleDocumentTypeChange}
                  >
                    Manage Users
                  </a>
                </div>
              </div>
              <div
                className="item"
                style={{
                  display: this.props.user.role === 'overlord' ?
                  'none' : 'block'
                }}
              >
                <div className="middle aligned content">
                  <a
                    className="item"
                    name="shared"
                    onClick={this.handleDocumentTypeChange}
                  >
                    Shared with me
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="thirteen wide column">
            <Grid>
              <Grid.Row>
                <Grid.Column width={8}>
                  <div
                    className="ui huge header"
                    id="documentHeader"
                    style={{
                      display: this.state.showUsers ? 'none' : 'block'
                    }}
                  >
                    {this.props.documentsType === 'role' ?
                      `${role.toUpperCase()} DOCUMENTS` :
                      `${this.props.documentsType.toUpperCase()} DOCUMENTS`
                    }
                  </div>
                  <div
                    id="userHeader"
                    className="ui huge header"
                    style={{
                      display: this.state.showUsers ? 'block' : 'none',
                    }}
                  >
                   MANAGE USERS
                  </div>
                </Grid.Column>
                <Grid.Column
                  width={8}
                >
                  <SearchComponent />
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <UserList show={this.state.showUsers} />
            <DocumentList show={!this.state.showUsers} />
          </div>
        </div>
      </div>
    );
  }
}

HomeContainer.propTypes = {
  logUserOut: PropType.func.isRequired,
  user: PropType.shape({
    isAuthenticated: PropType.bool.isRequired,
    id: PropType.number.isRequired,
    email: PropType.string.isRequired,
    username: PropType.string.isRequired,
    firstname: PropType.string.isRequired,
    lastname: PropType.string.isRequired,
    result: PropType.string.isRequired,
    role: PropType.string.isRequired,
    userUpdateSuccessful: PropType.bool
  }).isRequired,
  fetchDocuments: PropType.func.isRequired,
  fetchAllUsers: PropType.func.isRequired,
  fetchAllRoles: PropType.func.isRequired,
  getUser: PropType.func.isRequired,
  currentDocumentUpdated: PropType.bool.isRequired,
  currentDocumentModified: PropType.bool.isRequired,
  currentUserUpdated: PropType.bool.isRequired,
  documentsUpdated: PropType.bool.isRequired,
  documentSaved: PropType.bool.isRequired,
  savingDocument: PropType.bool.isRequired,
  currentDocumentModifying: PropType.bool.isRequired,
  documentDeleted: PropType.bool.isRequired,
  documentDeleting: PropType.bool.isRequired,
  userDeleted: PropType.bool.isRequired,
  userDeleting: PropType.bool.isRequired,
  documentsType: PropType.string,
  currentDocumentErrorMessage: PropType.string.isRequired
};

HomeContainer.defaultProps = {
  documents: PropType.shape({
    documentCreated: false
  }),
  currentDocument: null,
  documentsType: 'private'
};

const mapDispatchToProps = {
  logUserOut,
  fetchDocuments,
  fetchAllUsers,
  fetchAllRoles,
  getUser
};

const mapStateToProps = state => ({
  user: state.user,
  currentDocument: state.documents.currentDocument,
  documentsType: state.documents.documentsType,
  currentDocumentUpdated: state.documents.currentDocumentUpdated,
  currentDocumentModified: state.documents.currentDocumentModified,
  currentUser: state.user.currentUser,
  currentUserUpdated: state.user.currentUserUpdated,
  documentSaved: state.documents.documentSaved,
  documentsUpdated: state.documents.documentsUpdated,
  savingDocument: state.documents.savingDocument,
  currentDocumentModifying: state.documents.currentDocumentModifying,
  documentDeleted: state.documents.documentDeleted,
  documentDeleting: state.documents.documentDeleting,
  userDeleted: state.user.userDeleted,
  userDeleting: state.user.userDeleting,
  currentDocumentErrorMessage: state.documents.currentDocumentErrorMessage
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
