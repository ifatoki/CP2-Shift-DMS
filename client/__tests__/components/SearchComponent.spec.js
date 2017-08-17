import React from 'react';
import { mount } from 'enzyme';
import faker from 'faker';
import sinon from 'sinon';
import { SearchComponent } from '../../components/SearchComponent';

describe('Single Document Page', () => {
  const searchDocuments = jest.fn(() => Promise.resolve(true));
  const getDocument = jest.fn(() => Promise.resolve(true));

  const props = {
    searchDocuments,
    getDocument,
    documentsSearchResult: {}
  };

  const searchChangeSpy = sinon.spy(SearchComponent.prototype, 'handleSearchChange');
  const resetComponentSpy = sinon.spy(SearchComponent.prototype, 'resetComponent');
  const resultSelectSpy = sinon.spy(SearchComponent.prototype, 'handleResultSelect');

  const wrapper = mount(
    <SearchComponent
      {...props}
    />
  );

  it('renders', () => {
    expect(wrapper.find('.searchComponent'))
      .toHaveLength(1);
  });

//   describe('Class Methods', () => {
//     it('should call the onChange method when the Document \
//     types in firstname field', () => {
//       wrapper.find('textarea[name="title"]')
//         .simulate('change');
//       expect(onChangeSpy.called)
//         .toBeTruthy();
//     it('should call the saveDocument method when save is clicked', () => {
//       wrapper.find('.save.button')
//         .simulate('click');
//       expect(saveDocumentSpy.called)
//         .toBeTruthy();
//     });
//     it('should call the editDocument method when edit is clicked', () => {
//       wrapper.find('.edit.button')
//         .simulate('click');
//       expect(editDocumentSpy.called)
//         .toBeTruthy();
//     });
//     it('should call the cancelDocument method when cancel is clicked', () => {
//       wrapper.find('.cancel.button')
//         .simulate('click');
//       expect(cancelDocumentSpy.called)
//         .toBeTruthy();
//     });
//     it('should update state when props are modified', () => {
//       wrapper.setProps({
//         createNew: true
//       }, () => {
//         expect(wrapper.state('accessMode')).toBe('NEW');
//       });
//     });
//   });
});
