import React from 'react';
import PropType from 'prop-types';
import toastr from 'toastr';
import _ from 'lodash';
import ReactHtmlParser from 'react-html-parser';
import { connect } from 'react-redux';
import { Checkbox, Form } from 'semantic-ui-react';
import RoleSearchComponent from '../components/RoleSearchComponent';
import DocumentActions from '../actions/DocumentActions';

const {
  saveNewDocument,
  modifyDocument,
  cancelNewDocument
} = DocumentActions;

const editModes = {
  READ: 'READ',
  WRITE: 'WRITE',
  NEW: 'NEW'
};

toastr.options = {
  positionClass: 'toast-top-center',
  showMethod: 'slideDown',
  timeOut: 2000
};

export class DocumentManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      content: '',
      accessId: 2,
      rightId: 3, // Read access
      accessMode: this.props.createNew ?
       editModes.NEW : editModes.READ,
      selectedRoles: []
    };
    this.onChange = this.onChange.bind(this);
    this.saveDocument = this.saveDocument.bind(this);
    this.editDocument = this.editDocument.bind(this);
    this.handleRadioButtonChange = this.handleRadioButtonChange.bind(this);
    this.cancelNewDocument = this.cancelNewDocument.bind(this);
    this.onRolesChange = this.onRolesChange.bind(this);
  }

  componentDidMount() {
    tinymce.init({
      selector: '.tinymcepanel',
      init_instance_callback: (editor) => {
        editor.on('keyup', () => {
          this.setState({
            content: editor.getContent()
          });
        });
        editor.on('undo', () => {
          this.setState({
            content: editor.getContent()
          });
        });
        editor.on('redo', () => {
          this.setState({
            content: editor.getContent()
          });
        });
        editor.on('Change', () => {
          this.setState({
            content: editor.getContent()
          });
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentDocument, createNew, currentDocumentRoles, rightId
    } = nextProps;

    if (currentDocument || createNew) {
      this.setState({
        rightId,
        selectedRoles: currentDocumentRoles,
        accessMode: createNew ?
          editModes.NEW : editModes.READ,
      }, () => {
        const isNew = createNew;

        this.setState({
          title: isNew ? '' : currentDocument.title,
          content: isNew ? '' : currentDocument.content,
          accessId: isNew ? 2 : currentDocument.accessId
        }, () => {
          tinymce.activeEditor.setContent(this.state.content);
        });
      });
    }
  }

  onRolesChange(event, data) {
    this.setState({
      selectedRoles: data.value
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
    if (value === 3) {
      this.setState({ accessId: parseInt(value, 10) });
    } else {
      this.setState({
        accessId: parseInt(value, 10),
        selectedRoles: [this.props.user.roleId]
      });
    }
  }

  saveDocument(event) {
    const { currentDocument } = this.props;
    event.preventDefault();
    if (this.state.accessMode === editModes.NEW) {
      this.props.saveNewDocument({
        title: this.state.title,
        content: this.state.content,
        ownerId: this.props.user.id,
        accessId: this.state.accessId,
        roles: _.reduce(this.state.selectedRoles, (cummulator, value) => {
          if (value !== this.props.user.roleId) {
            cummulator[value] = 3;
          }
          return cummulator;
        }, {})
      });
    } else {
      const editData = {};
      if (this.state.title !== currentDocument.title) {
        editData.title = this.state.title;
      }
      if (this.state.content !== currentDocument.content) {
        editData.content = this.state.content;
      }
      if (this.state.accessId !== currentDocument.accessId ||
        this.state.accessId === 3) {
        editData.accessId = this.state.accessId;
        if (this.state.accessId === 3) {
          editData.roles =
            _.reduce(this.state.selectedRoles, (cummulator, value) => {
              cummulator[value] = 3;
              return cummulator;
            }, {});
        }
      }
      this.props.modifyDocument(currentDocument.id, editData);
    }
  }

  editDocument(event) {
    event.preventDefault();
    if (this.props.rightId < 3) {
      this.setState({
        accessMode: editModes.WRITE
      }, () => {
        tinymce.activeEditor.setContent(this.state.content);
      });
    }
  }

  cancelNewDocument(event) {
    event.preventDefault();
    this.props.cancelNewDocument();
  }

  render() {
    const { accessId } = this.state;
    return (
      <div className="ui longer fullscreen document modal documentManager">
        <div className="header">
          <div className="ui container intro">
            {this.props.createNew ?
            'Create your document here' :
            this.state.title}
          </div>
        </div>
        <div
          className="ui container"
        >
          <div
            className="ui form"
            style={{
              display: (
                this.state.accessMode === editModes.WRITE ||
                this.state.accessMode === editModes.NEW
              ) ? 'block' : 'none'
            }}
          >
            <div className="field">
              <textarea
                rows="1"
                placeholder="Title"
                name="title"
                onChange={this.onChange}
                value={this.state.title}
              />
            </div>
            <div
              className="two fields roleManagement"
              style={{
                display: this.props.user.role === 'overlord' ||
                (this.props.currentDocument && (this.props.user.id !==
                  this.props.currentDocument.ownerId)) ?
                  'none' : 'block'
              }}
            >
              <Form.Field width={3}>
                <Form.Field>
                  <Checkbox
                    radio
                    id="private"
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
                    id="public"
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
                    id="shared"
                    label="Shared"
                    name="accessRadioGroup"
                    checked={accessId === 3}
                    value="3"
                    onChange={this.handleRadioButtonChange}
                  />
                </Form.Field>
              </Form.Field>
              <Form.Field disabled={accessId !== 3} width={13}>
                <RoleSearchComponent
                  fluid
                  roles={this.props.user.roles}
                  onChange={this.onRolesChange}
                  selectedRoles={this.state.selectedRoles}
                />
              </Form.Field>
            </div>
            <div className="field">
              <textarea
                className="tinymcepanel"
                style={{ height: '50%' }}
              />
            </div>
          </div>
          <div
            id="contentHolder"
            className="scrolling content"
            style={{
              display: this.state.accessMode === editModes.READ ?
                'block' : 'none',
              height: '500px',
              overflowY: 'scroll'
            }}
          >
            { ReactHtmlParser(this.state.content) }
          </div>
        </div>
        <div
          className="ui actions container"
        >
          <div
            className="ui primary edit icon button"
            onClick={this.editDocument}
            style={{
              display: (
                (this.state.accessMode === editModes.READ) &&
                (this.state.rightId !== 3)
              ) ? 'inline-block' : 'none'
            }}
          >
            <i className="edit icon" />
          </div>
          <div
            className="ui primary save icon button"
            onClick={this.saveDocument}
            style={{
              display: this.state.accessMode === editModes.READ ?
                'none' : 'inline-block'
            }}
          >
            <i className="save icon" />
          </div>
          <div
            className="ui cancel button"
            onClick={this.cancelNewDocument}
            style={{
              display: (this.state.accessMode !== editModes.READ) ?
                'inline-block' : 'none'
            }}
          >
            Cancel
          </div>
          <div
            className="ui close button"
            onClick={this.cancelNewDocument}
            style={{
              display: (this.state.accessMode === editModes.READ) ?
                'inline-block' : 'none'
            }}
          >
            Close
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
    roles: PropType.arrayOf(PropType.object).isRequired,
    id: PropType.number.isRequired,
    email: PropType.string.isRequired,
    username: PropType.string.isRequired,
    firstname: PropType.string.isRequired,
    lastname: PropType.string.isRequired,
    result: PropType.string.isRequired,
    roleId: PropType.number.isRequired,
    role: PropType.string.isRequired
  }).isRequired,
  createNew: PropType.bool.isRequired,
  rightId: PropType.number.isRequired,
  currentDocumentRoles: PropType.arrayOf(PropType.number).isRequired,
  currentDocument: PropType.shape({
    id: PropType.number,
    title: PropType.string,
    content: PropType.string,
    ownerId: PropType.number,
    accessId: PropType.number
  }),
  cancelNewDocument: PropType.func.isRequired,
  modifyDocument: PropType.func.isRequired
};

DocumentManager.defaultProps = {
  currentDocument: null
};

const mapDispatchToProps = {
  saveNewDocument,
  cancelNewDocument,
  modifyDocument
};

const mapStateToProps = state => ({
  user: state.user,
  currentDocument: state.documents.currentDocument,
  rightId: state.documents.currentRightId,
  currentDocumentRoles: state.documents.currentDocumentRoles
});

export default connect(mapStateToProps, mapDispatchToProps)(DocumentManager);

