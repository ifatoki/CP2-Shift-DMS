import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import documentActions from '../actions/documentActions';

const { searchDocuments, getDocument } = documentActions;

/**
 * A React component that implements a document search feature
 *
 * @export
 * @class SearchComponent
 * @extends {Component}
 */
export class SearchComponent extends Component {
  /**
   * Creates an instance of SearchComponent.
   * @param {Object} props - Component Props
   * @memberof SearchComponent
   */
  constructor(props) {
    super(props);
    this.state = {
      results: {},
      isLoading: false,
      value: ''
    };
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.resetComponent = this.resetComponent.bind(this);
    this.handleResultSelect = this.handleResultSelect.bind(this);
  }

  componentWillMount() {
    this.resetComponent();
  }

  componentWillReceiveProps(nextProps) {
    const { documentsSearchResult } = nextProps;
    this.setState({
      isLoading: false,
      results: documentsSearchResult,
    });
  }

  /**
   * @method resetComponent
   *
   * @memberof SearchComponent
   * @returns {void}
   */
  resetComponent() {
    this.setState({ isLoading: false, results: [], value: '' });
  }

  /**
   * Triggers when a search result gets selected
   * @method handleResultSelect
   *
   * @param {Object} event - onClick event
   * @param {Object} eventResult - onClick data
   * @memberof SearchComponent
   * @returns {void}
   */
  handleResultSelect(event, { result }) {
    this.setState({
      value: result.title
    }, () => {
      this.props.getDocument(result.id);
    });
  }

  /**
   * Trigger when the search text is modified
   * @method handleSearchChange
   *
   * @param {Object} event - onChange event
   * @param {Object} eventValue - onChange data
   * @memberof SearchComponent
   * @returns {void}
   */
  handleSearchChange(event, { value }) {
    this.setState({
      isLoading: true,
      value
    }, () => this.props.searchDocuments(value));
  }

  /**
   * @method render
   *
   * @returns {void}
   * @memberof SearchComponent
   */
  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
        category
        fluid
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={this.handleSearchChange}
        results={results}
        value={value}
      />
    );
  }
}

SearchComponent.propTypes = {
  searchDocuments: PropTypes.func.isRequired,
  getDocument: PropTypes.func.isRequired,
  documentsSearchResult: PropTypes.shape({
    authored: PropTypes.object,
    public: PropTypes.object,
    role: PropTypes.object,
    shared: PropTypes.object
  }).isRequired
};

/**
 * @function mapStateToProps
 *
 * @param {Object} state - Redux state
 * @returns {object} props
 */
const mapStateToProps = state => ({
  documentsSearchResult: state.documents.documentsSearchResult
});

const mapDispatchToProps = {
  searchDocuments,
  getDocument
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);
