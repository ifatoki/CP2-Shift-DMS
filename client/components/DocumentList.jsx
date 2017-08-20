import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'semantic-ui-react';
import { connect } from 'react-redux';
import Document from './Document';

export /**
 * A React Component that shows an array of documents
 * @function DocumentList
 *
 * @param {any} props
 * @returns {void}
 */
const DocumentList = props => (
  <div
    className="ui divided items documentList"
    style={{
      paddingTop: '10px',
      marginTop: '0px',
      overflowY: 'scroll',
      height: '90%',
      display: props.show ? 'block' : 'none'
    }}
  >
    <Card.Group>
      {props.documents.map(document => (
        <Document
          key={document.id}
          title={document.title}
          content={document.content}
          created={document.createdAt}
          documentId={document.id}
        />
      ))}
    </Card.Group>
  </div>
);

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  show: PropTypes.bool.isRequired
};

/**
 * @function mapStateToProps
 *
 * @param {any} state
 * @returns {object} props
 */
const mapStateToProps = state => ({
  documents: state.documents.documents,
});

export default connect(mapStateToProps)(DocumentList);
