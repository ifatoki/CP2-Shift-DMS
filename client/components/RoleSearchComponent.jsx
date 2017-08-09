import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import _ from 'lodash';

const RoleSearchComponent = (props) => {
  const roles = _.map(props.roles, role => ({
    key: role.id,
    value: role.id,
    text: role.title
  }));
  return (
    <Dropdown
      placeholder="Role"
      fluid multiple search selection
      options={roles}
      onChange = {props.onChange}
    />
  );
};

export default RoleSearchComponent;
