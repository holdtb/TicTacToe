jest.mock('./Login/OktaSignInWidget.tsx', () => {
  return <div>SignIn</div>;
}); // See https://github.com/okta/okta-signin-widget/issues/935

import React from 'react';
import App from './App';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toBeDefined();
});
