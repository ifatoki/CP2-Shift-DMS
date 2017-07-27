import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Document from './Document';

const DocumentList = props => (
  <div
    className="ui divided items" style={{
      paddingTop: '10px',
      marginTop: '0px',
      overflowY: 'scroll',
      height: '90%'
    }}
  >
    {props.documents.map(document => (
      <Document
        key={document.id}
        title={document.title}
        content={document.content}
        created={document.createdAt}
        documentId={document.id}
      />
    ))}
  </div>
);

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = state => ({
  documents: state.documents.documents
});

export default connect(mapStateToProps)(DocumentList);
