import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logUserOut } from '../actions/users';
import { fetchDocuments, createNewDocument } from '../actions/documents';
import DocumentList from '../components/DocumentList';
import Document from '../components/Document';
import DocumentCreator from '../components/DocumentCreator';

class HomeContainer extends React.Component {
  constructor() {
    super();
    this.logOut = this.logOut.bind(this);
    this.initializeNewDocument = this.initializeNewDocument.bind(this);
  }

  componentDidMount() {
    this.props.fetchDocuments(this.props.user.id);
    $('.ui.dropdown')
      .dropdown();
  }
  
  initializeNewDocument(event) {
    event.preventDefault();
    $('.ui.modal')
      .modal('show');
  }

  logOut(event) {
    event.preventDefault();
    this.props.logUserOut();
  }
  newDocument(event) {
    event.preventDefault();
    this.props.createNewDocument();
  }

  render() {
    return (
      <div style={{ height: '100%' }} >
        <DocumentCreator initializeNewDocument={this.initializeNewDocument} />
        <div className="ui large top fixed hidden secondary white menu">
          <div className="ui container">
            <a className="active item">Home</a>
            <div className="right menu">
              <i
                className="big icons"
                style={{
                  margin: 'auto', cursor: 'pointer'
                }}
                role="button"
                onClick={this.initializeNewDocument}
              >
                <i className="file text icon blue" />
                <i className="corner inverted add icon" />
              </i>
              <div className="ui dropdown" style={{ margin: 'auto' }}>
                <div className="text">
                  <i className="user circle outline big blue icon" />
                  @{this.props.user.username}
                </div>
                <i className="dropdown icon" />
                <div className="menu">
                  <div className="item">
                    <a
                      className="ui button"
                      name="logout"
                      onClick={this.logOut}
                      role="button"
                    >
                      Log Out
                    </a>
                  </div>
                </div>
              </div>
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
              <div className="item">
                <div className="middle aligned content">
                  <a className="item">My Documents</a>
                </div>
              </div>
              <div className="item">
                <div className="middle aligned content">
                  <a className="item">Private Documents</a>
                </div>
              </div>
              <div className="item">
                <div className="middle aligned content">
                  <a className="item">Public Documents</a>
                </div>
              </div>
            </div>
          </div>
          <div className="thirteen wide column">
            <h1 className="center header">
              Yayyyy!!! Successfully logged in as @{ this.props.user.username }
            </h1>
            <DocumentList documents={this.props.documents.authored} />
          </div>
        </div>
      </div>
    );
  }
}

HomeContainer.propTypes = {
  logUserOut: PropTypes.func.isRequired,
  user: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    firstname: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    result: PropTypes.string.isRequired
  }).isRequired,
  fetchDocuments: PropTypes.func.isRequired,
  documents: PropTypes.shape({
    authored: PropTypes.arrayOf(Document).isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired
};

const mapDispatchToProps = {
  logUserOut,
  fetchDocuments,
  createNewDocument
};

const mapStateToProps = state => ({
  user: state.user,
  isAuthenticated: state.user.isAuthenticated,
  documents: state.documents
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
