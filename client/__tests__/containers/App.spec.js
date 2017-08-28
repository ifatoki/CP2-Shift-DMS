import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../../containers/App';

describe('Single Document Page', () => {
  const props = {
    isAuthenticated: true,
  };

  const wrapper = shallow(
    <App
      {...props}
    />
  );

  it('should render successfully showing 1 app class item', () => {
    expect(wrapper.find('.app'))
      .toHaveLength(1);
  });
});
