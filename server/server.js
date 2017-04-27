const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');

const users = require('./people.json');
const handler = require('./requestHandler.js');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text({defaultCharset: 'utf-8'}));

// sessions used for determining if user is logged in
app.use(session({
  secret: 'doctor patient',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, '../client')));

// Authentication routes
app.post('/api/login', handler.loginHandler);
app.get('/api/logout', handler.logoutHandler);
app.get('/api/authenticate', handler.authenticateHandler);

// Doctor routes
app.get('/api/patients', handler.getPatients);
app.post('/api/currentpatient', handler.updateCurrentPatient);
app.get('/api/patientdetails', handler.getPatientDetails);

// Patient routes
app.get('/api/overview', handler.getDetails);
app.get('/api/doctors', handler.getDoctors);

// Routes for doctor retrieving/making appointments
app.get('/api/doctorappointment', handler.doctorGetAppointments);
app.post('/api/doctorappointment', handler.doctorMakeAppointment);

// Routes for doctor approving/rejecting appointments
app.post('/api/approveappointment', handler.approveAppointment);
app.post('/api/rejectappointment', handler.rejectAppointment);

// Routes for patient retrieving/making appointments
app.get('/api/patientappointment', handler.patientGetAppointments);
app.post('/api/patientappointment', handler.patientMakeAppointment);

// Route for patient to cancel future appointments
app.post('/api/cancelappointment', handler.cancelAppointment);

app.get('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../client', 'index.html'));
});

app.listen(3000, function() {
  console.log('App is now listening on port 3000');
});