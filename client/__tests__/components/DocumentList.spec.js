import React from 'react';
import { mount, shallow } from 'enzyme';
import faker from 'faker';
import { DocumentList } from '../../components/DocumentList';

describe('Single User Page', () => {
  const props = {
    show: true,
    documents: []
  };

  const wrapper = mount(
    <DocumentList
      {...props}
    />
  );

  it('renders successfully having one documentList class item', () => {
    expect(wrapper.find('.documentList'))
      .toHaveLength(1);
  });

  describe('Class Methods', () => {
    it('loads all the documents in props.documents', () => {
      const shallowWrapper = shallow(
        <DocumentList {...props} />
      );
      shallowWrapper.setProps({
        documents: [{
          id: 1,
          title: faker.lorem.words,
          content: faker.lorem.paragraphs(2),
          created: Date.now().toLocaleString(),
          documentId: 3
        }, {
          id: 2,
          title: faker.lorem.words,
          content: faker.lorem.paragraphs(2),
          created: Date.now().toLocaleString(),
          documentId: 5
        }]
      }, () => {
        expect(shallowWrapper.find('Document'))
          .toHaveLength(2);
      });
    });
  });
});
