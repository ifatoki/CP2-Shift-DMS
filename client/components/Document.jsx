import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getDocument } from '../actions/documents';

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.clickHander = this.clickHander.bind(this);
  }

  clickHander() {
    this.props.getDocument(this.props.documentId);
  }

  render() {
    return (
      <div className="item" onClick={this.clickHander}>
        <div className="image">
          <img src="/images/wireframe/image.png" alt="The document" />
        </div>
        <div className="content">
          <a className="header">{this.props.title}</a>
          <div className="meta">
            <span className="cinema">
              <small>
                <i>Created on: {this.props.created}</i>
              </small>
            </span>
          </div>
          <div className="description">
            <p>{this.props.content}</p>
          </div>
          <div className="extra">
            <div className="ui label">IMAX</div>
            <div className="ui label">
              <i className="globe icon" />
              Additional Languages
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Document.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  getDocument: PropTypes.func.isRequired,
  documentId: PropTypes.number.isRequired
};

const mapDispatchToProps = {
  getDocument
};

export default connect(null, mapDispatchToProps)(Document);
