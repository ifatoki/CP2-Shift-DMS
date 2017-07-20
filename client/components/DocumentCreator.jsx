import React from 'react';
import PropType from 'prop-types';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import { createNewDocument } from '../actions/documents';

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
    this.props.createNewDocument({
      title: this.state.title,
      content: this.state.content,
      owner_id: this.props.user.id,
      accessId: this.state.accessId
    });
  }

  render() {
    const { accessId } = this.state;
    return (
      <div className="ui longer fullscreen modal">
        <div className="header">
          <div className="ui container">
            Create your document here
          </div>
        </div>
        <div className="ui container">
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
                style={{ height: '600px' }}
              />
            </div>
          </div>
        </div>
        <div className="actions ui container">
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
  createNewDocument: PropType.func.isRequired,
  user: PropType.shape({
    isAuthenticated: PropType.bool.isRequired,
    id: PropType.number.isRequired,
    email: PropType.string.isRequired,
    username: PropType.string.isRequired,
    firstname: PropType.string.isRequired,
    lastname: PropType.string.isRequired,
    result: PropType.string.isRequired,
    role: PropType.string.isRequired
  }).isRequired
};

const mapDispatchToProps = {
  createNewDocument
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentCreator);

