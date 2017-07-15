import React from 'react';
import PropType from 'prop-types';

class DocumentCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: ''
    };
    this.onChange = this.onChange.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  saveDocument(event) {
    event.preventDefault();
    this.props.saveNewDocument({
      title: this.state.title,
      content: this.state.content,
      owner_id: this.props.ownerId
    });
  }

  render() {
    return (
      <div className="ui modal">
        <div className="header">
          <div className="ui container text">
            Create your document here
          </div>
        </div>
        <div className="ui container text">
          <div className="ui form">
            <div className="field">
              <textarea
                rows="1" placeholder="Title"
                name="title"
                onChange={this.onChange}
              />
            </div>
            <div className="field">
              <textarea
                placeholder="Enter your content"
                name="content"
                onChange={this.onChange}
              />
            </div>
          </div>
        </div>
        <div className="actions ui container text">
          <div className="ui cancel button">
            Cancel
          </div>
          <div className="ui primary icon button">
            <i
              className="save icon"
              onClick={this.saveDocument}
            />
          </div>
        </div>
      </div>
    );
  }
}

DocumentCreator.propTypes = {
  saveNewDocument: PropType.func.isRequired,
  ownerId: PropType.number.isRequired
};

export default DocumentCreator;

