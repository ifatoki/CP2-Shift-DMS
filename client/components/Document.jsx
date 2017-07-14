import React from 'react';
import PropTypes from 'prop-types';

const Document = props => (
  <div className="item">
    <div className="image">
      <img src="/images/wireframe/image.png" alt="The document" />
    </div>
    <div className="content">
      <a className="header">{props.title}</a>
      <div className="meta">
        <span className="cinema">
          <small>
            <i>Created on: {props.created}</i>
          </small>
        </span>
      </div>
      <div className="description">
        <p>{props.content}</p>
      </div>
      <div className="extra">
        <div className="ui label">IMAX</div>
        <div className="ui label">
          <i className="globe icon" />
          Additional Languages
        </div>
      </div>
    </div>
  </div>
);

Document.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  created: PropTypes.string.isRequired
};

export default Document;
