import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logUserOut } from '../actions/users';
import { fetchDocuments } from '../actions/documents';
import DocumentList from '../components/DocumentList';

class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.fetchDocuments(this.props.id);
  }
  
  onSubmit(event) {
    event.preventDefault();
    this.props.logUserOut();
  }

  render() {
    return (
      <div>
        <div className="ui large top fixed hidden secondary menu">
          <div className="ui container">
            <a className="active item">Home</a><a className="item">Work</a><a className="item">Company</a><a className="item">Careers</a>
            <div className="right menu">
              <div className="item">
                <a className="ui button" name="logout" onClick={this.onSubmit}>Log Out</a>
              </div>
            </div>
          </div>
        </div>
        <div className="ui grid container" style={{ paddingTop: '60px', marginTop: '0px' }}>
          <div className="three wide column fixed">
            <i className="dropbox huge blue icon"></i>
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
              Yayyyy!!! Successfully logged in as @{ this.props.username }
            </h1>
            <DocumentList />
          </div>
        </div>
      </div>
    );
  }
}

HomeContainer.propTypes = {
  logUserOut: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

const mapDispatchToProps = {
  logUserOut,
  fetchDocuments
};

const mapStateToProps = state => ({
  id: state.user.id,
  username: state.user.username,
  email: state.user.email,
  firstname: state.user.firstname,
  lastname: state.user.lastname,
  isAuthenticated: state.user.isAuthenticated,
  authoredDocuments: state.documents
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);
