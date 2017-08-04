import React, { Component } from 'react';
import { Search, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { searchDocuments, getDocument } from '../actions/documents';

class SearchComponent extends Component {
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
      <Grid>
        <Grid.Column width={8}>
          <Search
            category
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={results}
            value={value}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

SearchComponent.propTypes = {
  searchDocuments: PropTypes.func.isRequired,
  getDocument: PropTypes.func.isRequired,
  documentsSearchResult: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  documentsSearchResult: state.documents.documentsSearchResult
});

const mapDispatchToProps = {
  searchDocuments,
  getDocument
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchComponent);
