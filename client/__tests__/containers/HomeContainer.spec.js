import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { HomeContainer } from '../../containers/HomeContainer';
import homeProps from '../../__mocks__/homeProps';

describe('Single Document Page', () => {
  const logUserOut = sinon.stub();
  const fetchDocuments = sinon.stub();
  const fetchAllRoles = sinon.stub();
  const fetchAllUsers = sinon.stub();
  const getUser = sinon.stub();

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
  const showUserProfileSpy = sinon.spy(
    HomeContainer.prototype, 'showUserProfile');
  const logOutSpy = sinon.spy(HomeContainer.prototype, 'logOut');
  const wrapper = shallow(
    <HomeContainer
      {...props}
    />
  );

  it('renders', () => {
    expect(wrapper.find('.homeContainer'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it('should change the document type when the document links are clicked',
    () => {
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
      expect(fetchDocuments.calledOnce)
        .toBeTruthy();
    });
    it('should call fetchAllRoles and fetchAllUsers when users gets clicked',
    () => {
      wrapper.find('a[name="users"]')
        .simulate('click', {
          preventDefault: () => {
          },
          target: {
            name: 'users'
          }
        });
      expect(fetchAllRoles.calledOnce)
        .toBeTruthy();
      expect(fetchAllUsers.calledOnce)
        .toBeTruthy();
    });
    it('should call the documentTypeChange function when user is clicked',
    () => {
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
    it('should call the logOut function when logout button is clicked', () => {
      wrapper.find('#logout')
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
    it('should call the showUserProfile method when icon is clicked', () => {
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
      });
      expect(wrapper.state('type')).toBe('american');
    });
    it('should call fetchDocuments when previous props is savingDocument' +
    'and current props is documentSaved', () => {
      let initialCallCount = fetchDocuments.callCount;
      wrapper.setProps({
        savingDocument: true
      });
      wrapper.setProps({
        documentSaved: true
      });
      expect(fetchDocuments.callCount === (initialCallCount += 1));
    });
    it('should call fetchDocuments when previous props is documentDeleting' +
    'and current props is documentDeleted', () => {
      let initialCallCount = fetchDocuments.callCount;
      wrapper.setProps({
        documentDeleting: true
      });
      wrapper.setProps({
        documentDeleted: true
      });
      expect(fetchDocuments.callCount === (initialCallCount += 1));
    });
    it(`should call fetchAllUsers and fetchAllRoles when props userDeleting
    is recieved`, () => {
      let initialFetchRolesCallCount = fetchAllRoles.callCount;
      let initialFetchUsersCallCount = fetchAllUsers.callCount;
      wrapper.setProps({
        userDeleting: true
      });
      wrapper.setProps({
        userDeleted: true
      });
      expect(fetchAllRoles.callCount === (initialFetchRolesCallCount += 1));
      expect(fetchAllUsers.callCount === (initialFetchUsersCallCount += 1));
    });
  });
});
