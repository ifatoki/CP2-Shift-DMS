import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Icon } from 'semantic-ui-react';
import ReactHtmlParser from 'react-html-parser';
import Timeago from 'timeago-react';
import DocumentActions from '../actions/DocumentActions';

const { getDocument, deleteDocument } = DocumentActions;

/**
 * A React Component to help create a single document
 *
 * @export
 * @class Document
 * @extends {React.Component}
 */
export class Document extends React.Component {
  /**
   * Creates an instance of Document.
   * @param {any} props
   * @memberof Document
   */
  constructor(props) {
    super(props);
    this.isDelete = false;
    this.clickHander = this.clickHander.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
  }

  /**
   * @method clickHandler
   *
   * @memberof Document
   * @returns {void}
   */
  clickHander() {
    if (!this.isDelete) {
      this.props.getDocument(this.props.documentId);
    }
    this.isDelete = false;
  }

  /**
   * @method deleteDocument
   *
   * @memberof Document
   * @returns {void}
   */
  deleteDocument() {
    this.isDelete = true;
    this.props.deleteDocument(this.props.documentId);
  }

  /**
   * @method render
   *
   * @returns {void}
   * @memberof Document
   */
  render() {
    return (
      <Card className="singleDocument" onClick={this.clickHander}>
        <div className="ui content">
          <Card.Header
            className="card-header"
            content={this.props.title}
          />
          <Card.Meta>
            Created <Timeago datetime={this.props.created} />
          </Card.Meta>
          <Card.Description className="description">
            { ReactHtmlParser(this.props.content) }
          </Card.Description>
        </div>
        <Card.Content extra>
          <Icon
            name="user"
            color="blue"
          />
          <div className="right floated">
            <Icon
              className="deleteDocument"
              name="trash"
              color="blue"
              onClick={this.deleteDocument}
            />
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
