import React from 'react';
import { mount } from 'enzyme';
import { SearchComponent } from '../../components/SearchComponent';

describe('Single Document Page', () => {
  const searchDocuments = jest.fn(() => Promise.resolve(true));
  const getDocument = jest.fn(() => Promise.resolve(true));

  const props = {
    searchDocuments,
    getDocument,
    documentsSearchResult: {}
  };

  const wrapper = mount(
    <SearchComponent
      {...props}
    />
  );

  it('renders the searchComponent successfully', () => {
    expect(wrapper.find('.searchComponent'))
      .toHaveLength(1);
  });
});
