import React from 'react';
import PropType from 'prop-types';
import TinyMCE from 'react-tinymce';
// import tinymce from 'tinymce/tinymce';
// import 'tinymce/themes/modern/theme';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import { saveNewDocument, cancelNewDocument } from '../actions/documents';

class DocumentManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: 'Itunuloluwa',
      accessId: 1,
      accessMode: this.props.createNew ?
        'READ' : 'NEW'
    };
    this.onChange = this.onChange.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
    this.cancelNewDocument = this.cancelNewDocument.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      accessMode: nextProps.createNew ?
        'NEW' : 'READ',
    }, () => {
      if (!(nextProps.currentDocument === null)) {
        this.setState({
          title: nextProps.currentDocument.title,
          content: nextProps.currentDocument.content,
          accessId: nextProps.currentDocument.AccessId
        });
      }
    });
  }

  onChange(event) {
    event.preventDefault();
    this.setState(event.target.name !== 'title' ?
      { content: event.target.getContent() } :
      { [event.target.name]: event.target.value }
    );
  }

  handleRadioButtonChange(event, { value }) {
    this.setState({ accessId: parseInt(value, 10) });
  }

  saveDocument(event) {
    event.preventDefault();
    this.props.saveNewDocument({
      title: this.state.title,
      content: this.state.content,
      owner_id: this.props.user.id,
      accessId: this.state.accessId
    });
  }

  cancelNewDocument(event) {
    event.preventDefault();
    this.props.cancelNewDocument();
  }

  render() {
    const { accessId } = this.state;
    return (
      <div className="ui longer fullscreen modal">
        <div className="header">
          <div className="ui container">
            {this.props.createNew ?
            'Create your document here' :
            this.state.title}
            <textarea
              rows="1" placeholder="Title"
              name="title"
              onChange={this.onChange}
              value={this.state.title}
            />
          </div>
        </div>
        <div className="ui container">
          <div className="ui form">
            <div className="field">
              <textarea
                rows="1" placeholder="Title"
                name="title"
                onChange={this.onChange}
                value={this.state.title}
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
              <TinyMCE
                content={this.state.content}
                config={{
                  plugins: 'autolink link image lists print preview',
                  toolbar:
                    'undo redo | bold italic | alignleft aligncenter alignright'
                }}
                onChange={this.onChange}
              />
            </div>
          </div>
        </div>
        <div className="actions ui container" onClick={this.cancelNewDocument}>
          <div className="ui cancel button">
            Cancel
          </div>
          <div
            className="ui primary approve icon button"
            onClick={this.saveDocument}
          >
            <i className="save icon" />
          </div>
        </div>
      </div>
    );
  }
}

DocumentManager.propTypes = {
  saveNewDocument: PropType.func.isRequired,
  user: PropType.shape({
    isAuthenticated: PropType.bool.isRequired,
    id: PropType.number.isRequired,
    email: PropType.string.isRequired,
    username: PropType.string.isRequired,
    firstname: PropType.string.isRequired,
    lastname: PropType.string.isRequired,
    result: PropType.string.isRequired,
    role: PropType.string.isRequired
  }).isRequired,
  createNew: PropType.bool.isRequired,
  currentDocument: PropType.shape({
    id: PropType.number,
    title: PropType.string,
    content: PropType.string,
    OwnerId: PropType.number,
    AccessId: PropType.number
  }),
  cancelNewDocument: PropType.func.isRequired
};

DocumentManager.defaultProps = {
  currentDocument: {}
};

const mapDispatchToProps = {
  saveNewDocument,
  cancelNewDocument
};

const mapStateToProps = state => ({
  user: state.user,
  currentDocument: state.documents.currentDocument,
  createNew: state.documents.createNew
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManager);

