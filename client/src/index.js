import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import axios from 'axios';

import Landing from './components/Landing.jsx';
import Login from './components/Login.jsx';
import Logout from './components/Logout.jsx';
import Patients from './components/Patients.jsx';
import PatientDetails from './components/PatientDetails.jsx';
import Overview from './components/Overview.jsx';

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

function requireDoctorAuth(nextState, replace, callback) {
  axios.get('/api/authenticate')
    .then(response => {
      if (!response.data.authenticated || !response.data.isDoctor) {
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
    <Route path="/" component={ Landing } />
    <Route path="/login" component={ Login } />
    <Route path="/logout" component={ Logout }>
      <Route path="/patients" component={ Patients } onEnter={ requireDoctorAuth } />
      <Route path="/patientdetails" component={ PatientDetails } onEnter={ requireDoctorAuth } />
      <Route path="/overview" component={ Overview } onEnter={ requireAuth } />
    </Route>
  </Router>
), document.getElementById('app'));