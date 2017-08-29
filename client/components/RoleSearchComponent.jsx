import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import lodash from 'lodash';
import PropTypes from 'prop-types';

/**
 * A React Component to help with Role selection
 * @function RoleSearchComponent
 *
 * @param {Object} props - Component Props
 * @returns {void}
 */
const RoleSearchComponent = (props) => {
  const roles = lodash.map(props.roles, role => ({
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
