import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';
import PropTypes from 'prop-types';

/**
 * @function RoleSearchComponent
 *
 * @param {any} props
 * @returns {void}
 */
const RoleSearchComponent = (props) => {
  const roles = _.map(props.roles, role => ({
    key: role.id,
    value: role.id,
    text: role.title
  }));
  return (
    <Dropdown
      fluid
      multiple
      search
      selection
      placeholder="Role"
      options={roles}
      value={props.selectedRoles}
      onChange={props.onChange}
    />
  );
};

RoleSearchComponent.propTypes = {
  selectedRoles: PropTypes.arrayOf(PropTypes.number).isRequired,
  roles: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired
};

export default RoleSearchComponent;
