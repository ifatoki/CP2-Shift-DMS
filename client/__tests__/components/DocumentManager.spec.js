import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import sinon from 'sinon';
import { DocumentManager } from '../../components/DocumentManager';

describe('Single Document Page', () => {
  const cancelNewDocument = jest.fn(() => Promise.resolve(true));
  const modifyDocument = jest.fn(() => Promise.resolve(true));
  const saveNewDocument = jest.fn(() => Promise.resolve(true));

  const props = {
    createNew: false,
    cancelNewDocument,
    saveNewDocument,
    modifyDocument,
    user: {
      isAuthenticated: true,
      id: 1,
      email: faker.internet.email(),
      username: faker.internet.userName(),
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
      result: '',
      role: 'user',
      roleId: 1,
      roles: []
    },
    rightId: 3,
    currentDocument: {},
    currentDocumentRoles: []
  };

  const onChangeSpy = sinon.spy(DocumentManager.prototype, 'onChange');
  const saveDocumentSpy = sinon.spy(DocumentManager.prototype, 'saveDocument');
  const editDocumentSpy = sinon.spy(DocumentManager.prototype, 'editDocument');
  const cancelDocumentSpy = sinon.spy(DocumentManager.prototype,
    'cancelNewDocument');

  const wrapper = mount(
    <DocumentManager
      {...props}
    />
  );

  it('renders the documentManager element successfully', () => {
    expect(wrapper.find('.documentManager'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it(`should call the onChange method when user types
    in firstname field`, () => {
      wrapper.find('textarea[name="title"]')
        .simulate('change');
      expect(onChangeSpy.called)
        .toBeTruthy();
    });
    it('should call the saveDocument method when save is clicked', () => {
      wrapper.find('.save.button')
        .simulate('click');
      expect(saveDocumentSpy.called)
        .toBeTruthy();
    });
    it('should call the editDocument method when edit is clicked', () => {
      wrapper.find('.edit.button')
        .simulate('click');
      expect(editDocumentSpy.called)
        .toBeTruthy();
    });
    it('should call the cancelDocument method when cancel is clicked', () => {
      wrapper.find('.cancel.button')
        .simulate('click');
      expect(cancelDocumentSpy.called)
        .toBeTruthy();
    });
    it('should update state when props are modified', () => {
      wrapper.setProps({
        createNew: true
      }, () => {
        expect(wrapper.state('accessMode')).toBe('NEW');
      });
    });
  });
});
