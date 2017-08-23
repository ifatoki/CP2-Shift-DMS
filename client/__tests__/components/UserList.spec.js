import React from 'react';
import { mount, shallow } from 'enzyme';
import faker from 'faker';
import { UserList } from '../../components/UserList';

describe('Single User Page', () => {
  const props = {
    show: true,
    users: [],
    roles: [],
    isUpdating: false
  };

  const wrapper = mount(
    <UserList
      {...props}
    />
  );

  it('renders the component successfully', () => {
    expect(wrapper.find('.userList'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it('search for matching Users when a user starts typing', () => {
      const shallowWrapper = shallow(
        <UserList {...props} />
      );
      shallowWrapper.setProps({
        users: [{
          id: 1,
          username: faker.internet.userName(),
          email: faker.internet.email(),
          firstname: faker.name.firstName(),
          lastname: faker.name.lastName(),
          created: Date.now().toLocaleString(),
          role: 'author'
        }]
      }, () => {
        expect(shallowWrapper.find('User'))
          .toHaveLength(1);
      });
    });
  });
});
