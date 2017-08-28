import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import classNames from 'classnames';
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
    className={
      classNames('ui divided items document-list', props.show ?
        'visible-block' : 'not-visible')
    }
  >
    <div
      className={
        classNames('list-status', props.isUpdating ?
          'visible-block' : 'not-visible')
      }
    >
      <Icon loading name="spinner" />
      <p>Fetching Documents...</p>
    </div>
    <div
      className={
        classNames(props.isUpdating ?
          'not-visible' : 'visible-inline-block')
      }
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
      className={
        classNames('list-status', (
          !props.isUpdating && !props.documents.length) ?
            'visible-block' : 'not-visible')}
    >
      <Icon name="warning sign" />
      <p>No Documents Found!!!</p>
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
