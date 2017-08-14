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

  it('should render successfully', () => {
    expect(wrapper.find('.app'))
      .toHaveLength(1);
  });
  // it('should render the homeContainer when isAuthenticated is true', () => {
  //   expect(wrapper.find('HomeContainer'))
  //     .toHaveLength(1);
  // });
  // it('should update state when props are modified', () => {
  //   wrapper.setProps({
  //     isAuthenticated: false
  //   }, () => {
  //     expect(wrapper.find('LandingContainer'))
  //       .toHaveLength(1);
  //   });
  // });
});
