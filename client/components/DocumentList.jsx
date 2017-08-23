import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'semantic-ui-react';
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
    <div
      style={{
        verticalAlign: 'middle',
        textAlign: 'center',
        fontSize: '70px',
        fontFamily: 'Indie Flower',
        color: '#696969',
        display: props.isUpdating ? 'block' : 'none'
      }}
    >
      <Icon loading name="spinner" />
      <p
        style={{
          fontSize: '50px'
        }}
      >Fetching Documents...</p>
    </div>
    <div
      style={{
        display: props.isUpdating ? 'none' : 'inline-block'
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
    <div
      style={{
        verticalAlign: 'middle',
        textAlign: 'center',
        fontSize: '70px',
        fontFamily: 'Indie Flower',
        color: '#696969',
        display: (!props.isUpdating && !props.documents.length) ?
          'block' : 'none'
      }}
    >
      <Icon name="warning sign" />
      <p
        style={{
          fontSize: '50px'
        }}
      >No Documents Found!!!</p>
    </div>
  </div>
);

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  isUpdating: PropTypes.bool,
  show: PropTypes.bool.isRequired
};

DocumentList.defaultProps = {
  isUpdating: false
};

/**
 * @function mapStateToProps
 *
 * @param {any} state
 * @returns {object} props
 */
const mapStateToProps = state => ({
  documents: state.documents.documents,
  isUpdating: state.documents.documentsUpdating
});

export default connect(mapStateToProps)(DocumentList);
