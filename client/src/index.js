import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import axios from 'axios';

import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Patients from './components/Patients.jsx';

function requireAuth(nextState, replace, callback) {
  axios.get('/api/authenticate')
    .then(response => {
      if (!response.data.authenticated) {
        replace('/login');
      }
      callback();
    })
    .catch(error => {
      callback();
    });
}

ReactDOM.render((
  <Router history={ browserHistory }>
    <Route path="/" component={ Home }>
      <Route path="/login" component={ Login } />
      <Route path="/patients" component={ Patients } onEnter={ requireAuth } />
    </Route>
  </Router>
), document.getElementById('app'));