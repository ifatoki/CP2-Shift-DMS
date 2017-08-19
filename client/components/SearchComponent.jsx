import React, { Component } from 'react';
import { Search } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DocumentActions from '../actions/DocumentActions';

const { searchDocuments, getDocument } = DocumentActions;

export class SearchComponent extends Component {
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

  resetComponent() {
    this.setState({ isLoading: false, results: [], value: '' });
  }

  handleResultSelect(e, { result }) {
    this.setState({
      value: result.title
    }, () => {
      this.props.getDocument(result.id);
    });
  }

  handleSearchChange(e, { value }) {
    this.setState({
      isLoading: true,
      value
    }, () => this.props.searchDocuments(value));
  }

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

const mapStateToProps = state => ({
  documentsSearchResult: state.documents.documentsSearchResult
});

const mapDispatchToProps = {
  searchDocuments,
  getDocument
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);
