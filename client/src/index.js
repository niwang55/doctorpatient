import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import Home from './components/Home.jsx';
import Login from './components/Login.jsx';

ReactDOM.render((
  <Router history={ browserHistory }>
    <Route path="/" component={ Home }>
      <Route path="/login" component={ Login } />
    </Route>
  </Router>
), document.getElementById('app'));