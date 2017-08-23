import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { LandingContainer } from '../../containers/LandingContainer';

describe('Single Document Page', () => {
  const logUserIn = jest.fn(() => Promise.resolve(true));
  const signUserUp = jest.fn(() => Promise.resolve(true));
  const fetchAllRoles = jest.fn(() => Promise.resolve(true));

  const props = {
    logUserIn,
    signUserUp,
    fetchAllRoles,
    currentUserErrorMessage: '',
  };

  const onChangeSpy = sinon.spy(LandingContainer.prototype, 'onChange');
  const onLoginSubmitSpy = sinon.spy(
    LandingContainer.prototype, 'onLoginSubmit');
  const onSignUpSubmitSpy = sinon.spy(
    LandingContainer.prototype, 'onSignUpSubmit');

  const wrapper = mount(
    <LandingContainer
      {...props}
    />
  );

  it('renders successfully with only one landingContainer class', () => {
    expect(wrapper.find('.landingContainer'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it('should call the onChange method when the text' +
    'in firstname field changes', () => {
      wrapper.find('input[name="firstname"]')
        .simulate('change');
      expect(onChangeSpy.called)
        .toBeTruthy();
    });
    it('should call the onLoginSubmit method when login is clicked', () => {
      wrapper.find('#login')
        .simulate('click');
      expect(onLoginSubmitSpy.called)
        .toBeTruthy();
    });
    it('should call the signUp method when signup is clicked', () => {
      wrapper.find('#signup')
        .simulate('click');
      expect(onSignUpSubmitSpy.called)
        .toBeTruthy();
    });
    it('should update state when props are modified', () => {
      const roles = [{
        id: 1,
        title: 'fellow'
      }, {
        id: 2,
        title: 'success'
      }, {
        id: 3,
        title: 'learning'
      }];

      wrapper.setProps({
        roles,
        createNew: true
      });
      expect(wrapper.state('roles')[1]).toEqual({
        key: roles[1].id,
        text: roles[1].title,
        value: roles[1].id
      });
    });
  });
});
