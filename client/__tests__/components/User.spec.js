import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import sinon from 'sinon';
import { User } from '../../components/User';

describe('Single User Page', () => {
  const getUser = jest.fn(() => Promise.resolve(true));
  const deleteUser = jest.fn(() => Promise.resolve(true));

  const props = {
    key: 1,
    id: 1,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    created: Date.now().toLocaleString(),
    role: 'author'
  };

  const wrapper = mount(
    <User
      getUser={getUser}
      deleteUser={deleteUser}
      {...props}
    />
  );

  it('renders', () => {
    expect(wrapper.find('Card'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it('search for matching Users when a user starts typing', () => {
      const spy = sinon.spy(User.prototype, 'deleteUser');
      const shallowWrapper = mount(
        <User
          getUser={getUser}
          deleteUser={deleteUser}
          {...props}
        />
      );
      shallowWrapper.find('.deleteUser')
        .simulate('click');
      expect(spy.called)
        .toBeTruthy();
    });
  });
});
