import React from 'react';
import { mount, shallow } from 'enzyme';
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

  // const wrapper = mount(
  //   <Provider store={store}>
  //     <HomeContainer
  //       {...props}
  //     />
  //   </Provider>,
  // );

  const wrapper = shallow(
    <HomeContainer
      {...props}
    />
  )
  it('renders', () => {
    expect(wrapper.find('.homeContainer'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it('should call the onChange method when the text \
    in firstname field changes', () => {
      wrapper.find('a[name="private"]')
        .simulate('click', {
          preventDefault: () => {
          },
          target: {
            name: 'input'
          }
         });
      expect(documentTypeChangeSpy.called)
        .toBeTruthy();
    });
    it('should call the onChange method when the text \
    in firstname field changes', () => {
      wrapper.find('a[name="users"]')
        .simulate('click', {
          preventDefault: () => {},
          target: {
            name: 'input'
          }
        });
      expect(documentTypeChangeSpy.called)
        .toBeTruthy();
    });
    it('should call the onLoginSubmit method when login is clicked', () => {
      wrapper.find('a[name="logout"]')
        .simulate('click', {
          preventDefault: () => {
          },
          target: {
            name: 'input',
          }
         });
      expect(logOutSpy.called)
        .toBeTruthy();
    });
    it('should call the signUp method when signup is clicked', () => {
      wrapper.find('i[name="showUserProfile"]')
        .simulate('click', {
          preventDefault: () => {
          },
          target: {
            name: 'input',
          }
         });
      expect(showUserProfileSpy.called)
        .toBeTruthy();
    });
    it('should update state when props are modified', () => {
      wrapper.setProps({
        documentsUpdated: true,
        documentsType: 'american'
      }, () => {
        expect(wrapper.state('type')).toBe('american');
      });
    });
  });
});
