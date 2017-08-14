import React from 'react';
import { mount } from 'enzyme';
import sinon from 'sinon';
import thunk from 'redux-thunk';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { HomeContainer } from '../../containers/HomeContainer';
import reducers from '../../__mocks__/reducers';
import homeProps from '../../__mocks__/homeProps';

describe('Single Document Page', () => {
  const logUserOut = jest.fn(() => Promise.resolve(true));
  const fetchDocuments = jest.fn(() => Promise.resolve(true));
  const fetchAllRoles = jest.fn(() => Promise.resolve(true));
  const fetchAllUsers = jest.fn(() => Promise.resolve(true));
  const getUser = jest.fn(() => Promise.resolve(true));
  const store = createStore(
    reducers,
    [thunk]
  );

  const props = {
    logUserOut,
    fetchDocuments,
    fetchAllUsers,
    fetchAllRoles,
    getUser,
    ...homeProps
  };

  const documentTypeChangeSpy = sinon.spy(
      HomeContainer.prototype, 'handleDocumentTypeChange');
  const initializeNewDocumentSpy = sinon.spy(
      HomeContainer.prototype, 'initializeNewDocument');
  const showUserProfileSpy = sinon.spy(
      HomeContainer.prototype, 'showUserProfile');
  const logOutSpy = sinon.spy(HomeContainer.prototype, 'logOut');

  const wrapper = mount(
    <Provider store={store}>
      <HomeContainer
        {...props}
      />
    </Provider>,
  );

  it('renders', () => {
    expect(wrapper.find('.homeContainer'))
      .toHaveLength(1);
  });

  // describe('Class Methods', () => {
  //   it('should call the onChange method when the text \
  //   in firstname field changes', () => {
  //     wrapper.find('input[name="firstname"]')
  //       .simulate('change');
  //     expect(onChangeSpy.called)
  //       .toBeTruthy();
  //   });
  //   it('should call the onLoginSubmit method when login is clicked', () => {
  //     wrapper.find('#login')
  //       .simulate('click');
  //     expect(onLoginSubmitSpy.called)
  //       .toBeTruthy();
  //   });
  //   it('should call the signUp method when signup is clicked', () => {
  //     wrapper.find('#signup')
  //       .simulate('click');
  //     expect(onSignUpSubmitSpy.called)
  //       .toBeTruthy();
  //   });
  //   it('should update state when props are modified', () => {
  //     const roles = [{
  //       id: 1,
  //       title: 'fellow'
  //     }, {
  //       id: 2,
  //       title: 'success'
  //     }, {
  //       id: 3,
  //       title: 'learning'
  //     }];

  //     wrapper.setProps({
  //       roles,
  //       createNew: true
  //     }, () => {
  //       expect(wrapper.state('roles')[1]).toEqual({
  //         key: roles[1].id,
  //         text: roles[1].title,
  //         value: roles[1].id
  //       });
  //     });
  //   });
  // });
});
