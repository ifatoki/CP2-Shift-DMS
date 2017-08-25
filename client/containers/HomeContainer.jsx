import React from 'react';
import { Grid, Dropdown } from 'semantic-ui-react';
import toastr from 'toastr';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';
import classNames from 'classnames';
import usersActions from '../actions/usersActions';
import documentActions from '../actions/documentActions';
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
} = usersActions;
const { fetchDocuments } = documentActions;

toastr.options = {
  positionClass: 'toast-top-center',
  showMethod: 'slideDown',
  timeOut: 2000
};

/**
 * @export
 * @class HomeContainer
 * @extends {React.Component}
 */
export class HomeContainer extends React.Component {
  /**
   * Creates an instance of HomeContainer.
   * @param {any} props
   * @memberof HomeContainer
   */
  constructor(props) {
    super(props);
    this.state = {
      type: 'private',
      showUsers: false,
      createNewDocument: false,
      activePage: 0
    };
    this.logOut = this.logOut.bind(this);
    this.showUserProfile = this.showUserProfile.bind(this);
    this.initializeNewDocument = this.initializeNewDocument.bind(this);
    this.handleDocumentTypeChange = this.handleDocumentTypeChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  /**
   * @method componentDidMount
   *
   * @memberof HomeContainer
   * @returns {void}
   */
  componentDidMount() {
    let type = 'private';

    if (this.props.user.id === 1) {
      type = 'public';
    }
    this.props.fetchDocuments(type);
  }

  /**
   * @method componentWillReceiveProps
   *
   * @param {any} nextProps
   * @memberof HomeContainer
   * @returns {void}
   */
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
          this.props.fetchDocuments(this.state.type);
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
            this.props.fetchDocuments(this.state.type);
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

  /**
   * @method handleDocumentTypeChange
   *
   * @param {any} event
   * @memberof HomeContainer
   * @returns {void}
   */
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
        this.props.fetchDocuments(this.state.type);
      }
    });
  }

  /**
   * @method handlePageChange
   *
   * @param {any} pageNumber
   * @memberof HomeContainer
   * @returns {void}
   */
  handlePageChange(pageNumber) {
    this.setState({
      activePage: pageNumber.selected
    }, () => this.props.fetchDocuments(
      this.state.type, Math.ceil((this.state.activePage) * 9)
    ));
  }

  /**
   * @method showUserProfile
   *
   * @memberof HomeContainer
   * @returns {void}
   */
  showUserProfile() {
    this.props.getUser(this.props.user.id);
  }

  /**
   * @method initializeNewDocument
   *
   * @memberof HomeContainer
   * @returns {void}
   */
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

  /**
   * @method logOut
   *
   * @param {any} event
   * @memberof HomeContainer
   * @returns {void}
   */
  logOut(event) {
    event.preventDefault();
    this.props.logUserOut();
  }

  /**
   * @method render
   *
   * @returns {void}
   * @memberof HomeContainer
   */
  render() {
    const role = this.props.user.role.charAt(0).toUpperCase()
      + this.props.user.role.slice(1);
    return (
      <div
        className="homeContainer inherit"
      >
        <DocumentManager
          createNew={this.state.createNewDocument}
        />
        <UserManager />
        <div className="ui large top fixed hidden secondary white menu">
          <div className="ui container">
            <div className="right menu">
              <i
                className="big icons navbar-icon"
                id="newDocument"
                role="button"
                name="newDocument"
                onClick={this.initializeNewDocument}
              >
                <i className="file text icon blue" />
                <i className="corner inverted add icon" />
              </i>
              <i
                id="userProfile"
                className="big icons navbar-icon"
                name="showUserProfile"
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
          className="ui grid container inherit sub-home-container"
        >
          <div className="three wide column fixed">
            <i className="dropbox huge blue icon" />
            <div className="ui divided items">
              <div
                className={
                  classNames('item', this.props.user.role === 'overlord' ?
                    'not-visible' : 'visible-block')
                }
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
                className={
                  classNames('item', this.props.user.role === 'overlord' ?
                    'not-visible' : 'visible-block')
                }
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
                className={
                  classNames('item', this.props.user.role === 'overlord' ?
                    'visible-block' : 'not-visible')
                }
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
                className="item not-visible"
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
                <div className="eight wide column">
                  <div
                    className={
                      classNames('ui huge header', this.state.showUsers ?
                        'not-visible' : 'visible-block')
                    }
                    id="documentHeader"
                  >
                    {this.props.documentsType === 'role' ?
                      `${role.toUpperCase()} DOCUMENTS` :
                      `${this.props.documentsType.toUpperCase()} DOCUMENTS`
                    }
                  </div>
                  <div
                    id="userHeader"
                    className={
                      classNames('ui huge header', this.state.showUsers ?
                        'visible-block' : 'not-visible')
                    }
                  >
                   MANAGE USERS
                  </div>
                </div>
                <div
                  className={
                    classNames('eight wide column', this.state.showUsers ?
                      'not-visible' : 'visible-block')
                  }
                >
                  <SearchComponent />
                </div>
              </Grid.Row>
            </Grid>
            <UserList show={this.state.showUsers} />
            <DocumentList show={!this.state.showUsers} />
            <ReactPaginate
              previousLabel={'previous'}
              nextLabel={'next'}
              breakLabel={<a>...</a>}
              breakClassName={'break-me'}
              pageCount={Math.ceil(this.props.documentsCount / 9)}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageChange}
              containerClassName={`pagination ${
                this.state.showUsers ? 'not-visible' : 'visible-flex'
              }`}
              subContainerClassName={'pages pagination'}
              activeClassName={'active-page'}
            />
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
  documentsCount: PropType.number.isRequired,
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

/**
 * @function mapStateToProps
 *
 * @param {any} state
 * @returns {object} props
 */
const mapStateToProps = state => ({
  user: state.user,
  currentDocument: state.documents.currentDocument,
  documentsType: state.documents.documentsType,
  documentsCount: state.documents.documentsCount,
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
