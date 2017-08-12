import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Icon } from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import Timeago from 'timeago-react';
import { getDocument, deleteDocument } from '../actions/documents';

class Document extends React.Component {
  constructor(props) {
    super(props);
    this.isDelete = false;
    this.clickHander = this.clickHander.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
  }

  clickHander() {
    if (!this.isDelete) {
      this.props.getDocument(this.props.documentId);
    }
    this.isDelete = false;
  }

  deleteDocument() {
    this.isDelete = true;
    this.props.deleteDocument(this.props.documentId);
  }

  render() {
    return (
      <Card onClick={this.clickHander}>
        <Card.Content>
          <Card.Header>
            {this.props.title}
          </Card.Header>
          <Card.Meta>
            Created <Timeago datetime={this.props.created} />
          </Card.Meta>
          <Card.Description>
            { ReactHtmlParser(this.props.content) }
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Icon name="user" color="blue" />
          @itunuworks
          <div className="right floated">
            <Icon name="trash" color="blue" onClick={this.deleteDocument} />
          </div>
        </Card.Content>
      </Card>
    );
  }
}

Document.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired,
  getDocument: PropTypes.func.isRequired,
  deleteDocument: PropTypes.func.isRequired,
  documentId: PropTypes.number.isRequired
};

const mapDispatchToProps = {
  getDocument,
  deleteDocument
};

export default connect(null, mapDispatchToProps)(Document);
