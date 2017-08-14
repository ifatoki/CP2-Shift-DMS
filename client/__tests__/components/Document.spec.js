import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import { Document } from '../../components/Document';

describe('Single Document Page', () => {
  const getDocument = jest.fn(() => Promise.resolve(true));
  const deleteDocument = jest.fn(() => Promise.resolve(true));

  const props = {
    key: 1,
    title: 'The birth of history',
    content:
      'It all just happened in flash and all we saw was the life we now live',
    created: Date.now().toLocaleString(),
    documentId: 1
  };

  const wrapper = mount(
    <Document
      getDocument={getDocument}
      deleteDocument={deleteDocument}
      {...props}
    />
  );

  it('renders', () => {
    expect(wrapper.find('Card'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it('search for matching documents when a user starts typing', () => {
      const spy = sinon.spy(Document.prototype, 'deleteDocument');
      const shallowWrapper = mount(
        <Document
          getDocument={getDocument}
          deleteDocument={deleteDocument}
          {...props}
        />
      );
      shallowWrapper.find('.deleteDocument')
        .simulate('click');
      expect(spy.called)
        .toBeTruthy();
    });
  });
});

