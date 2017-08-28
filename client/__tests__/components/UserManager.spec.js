import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { UserManager } from '../../components/UserManager';

describe('Single User Page', () => {
  const cancelUser = jest.fn(() => Promise.resolve(true));
  const modifyUser = jest.fn(() => Promise.resolve(true));

  const props = {
    currentUser: {},
    cancelUser,
    modifyUser,
    signedInRole: '',
    currentUserModifying: false,
    currentUserModified: false,
    currentUserErrorMessage: ''
  };

  const onChangeSpy = sinon.spy(UserManager.prototype, 'onChange');
  const selectionChangeSpy = sinon.spy(
    UserManager.prototype, 'handleSelectionChange');
  const saveUserSpy = sinon.spy(UserManager.prototype, 'saveUser');
  const editUserSpy = sinon.spy(UserManager.prototype, 'editUser');
  const cancelUserSpy = sinon.spy(UserManager.prototype, 'cancelUser');

  const wrapper = mount(
    <UserManager
      {...props}
    />
  );

  it('renders', () => {
    expect(wrapper.find('.userManager'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it('should call the onChange method when the user types in firstname field',
    () => {
      wrapper.find('input[name="firstname"]')
        .simulate('change');
      expect(onChangeSpy.called)
        .toBeTruthy();
    });
    it(`should call the handleChange method when the checkbox
    selection changes`, () => {
      wrapper.find('input[type="checkbox"]')
        .simulate('change');
      expect(selectionChangeSpy.called)
        .toBeTruthy();
    });
    it('should call the saveUser method when save is clicked', () => {
      wrapper.find('.save.button')
        .simulate('click');
      expect(saveUserSpy.called)
        .toBeTruthy();
    });
    it('should call the editUser method when edit is clicked', () => {
      wrapper.find('.edit.button')
        .simulate('click');
      expect(editUserSpy.called)
        .toBeTruthy();
    });
    it('should call the cancelUser method when cancel is clicked', () => {
      wrapper.find('.cancel.button')
        .simulate('click');
      expect(cancelUserSpy.called)
        .toBeTruthy();
    });
  });
});
