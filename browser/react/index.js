import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from './containers/AppContainer';

import { BrowserRouter, Link } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <AppContainer />
  </BrowserRouter>, document.getElementById('app')
)
