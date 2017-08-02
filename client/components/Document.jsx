import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, Icon } from 'semantic-ui-react';
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
      <Card onClick={this.clickHander}>
        <Card.Content>
          <Card.Header>
            {this.props.title}
          </Card.Header>
          <Card.Meta content={this.props.created} />
          <Card.Description content={this.props.content} />
        </Card.Content>
        <Card.Content extra>
          <Icon name="user" color="blue" />
          @itunuworks
          <div className="right floated">
            <Icon name="trash" color="blue" />
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
  documentId: PropTypes.number.isRequired
};

const mapDispatchToProps = {
  getDocument
};

export default connect(null, mapDispatchToProps)(Document);
