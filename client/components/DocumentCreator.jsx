import React from 'react';
import PropType from 'prop-types';
import { Checkbox, Form } from 'semantic-ui-react';

class DocumentCreator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      accessId: 1
    };
    this.onChange = this.onChange.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleRadioButtonChange(event, { value }) {
    this.setState({ accessId: parseInt(value, 10) });
  }

  saveDocument(event) {
    event.preventDefault();
    this.props.saveNewDocument({
      title: this.state.title,
      content: this.state.content,
      owner_id: this.props.ownerId,
      accessId: this.state.accessId
    });
  }

  render() {
    const { accessId } = this.state;
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
            <div className="two fields">
              <Form.Field width={3}>
                <Form.Field>
                  <Checkbox
                    radio
                    label="Private"
                    name="accessRadioGroup"
                    checked={accessId === 1}
                    value="1"
                    onChange={this.handleRadioButtonChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    radio
                    label="Public"
                    name="accessRadioGroup"
                    checked={accessId === 2}
                    value="2"
                    onChange={this.handleRadioButtonChange}
                  />
                </Form.Field>
                <Form.Field>
                  <Checkbox
                    radio
                    label="Shared"
                    name="accessRadioGroup"
                    checked={accessId === 3}
                    value="3"
                    onChange={this.handleRadioButtonChange}
                  />
                </Form.Field>
              </Form.Field>
              <Form.Field disabled={accessId !== 3} width={13}>
                <h1>Itunuloluwa</h1>
              </Form.Field>
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

