import React from 'react';
import axios from 'axios';
import Datetime from 'react-datetime';
import moment from 'moment';

export default class PatientDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      name: null,
      age: null,
      email: null,
      address: null,
      phone: null,
      appointments: null,
      appointmentDateTime: null,
      reason: ''
    };
  }

  componentWillMount() {
    axios.get('/api/patientdetails')
    .then(response => {
      let patient = response.data;
      this.setState({
        username: patient.username,
        name: patient.name,
        age: patient.age,
        email: patient.email,
        address: patient.address,
        phone: patient.phone
      });
    });

    axios.get('/api/doctorappointment')
    .then(response => {
      this.setState({
        appointments: [...response.data]
      });
    });
  }

  handleDatetimeChange(e) {
    this.setState({
      appointmentDateTime: e._d.toLocaleString()
    });
  }

  handleMakeAppointment(e) {
    e.preventDefault();

    if (this.state.appointmentDateTime) {

      // Post to api with appointment time and selected doctor
      axios.post('/api/doctorappointment', {
        time: this.state.appointmentDateTime,
        patientUser: this.state.username
      })
      .then(response => {
        return axios.get('/api/doctorappointment');
      })
      .then(response => {
        this.setState({
          appointments: [...response.data]
        });
      })
      .catch(error => console.log(error));

    } else {
      alert('Please choose a time');
    }
  }

  handleApproveClick(appointment) {
    axios.post('/api/approveappointment', {
      appointmentId: appointment.appointmentId,
      patientUser: appointment.patientUser
    })
    .then(response => {
      return axios.get('/api/doctorappointment');
    })
    .then(response => {
      this.setState({
        appointments: [...response.data]
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleRejectClick(appointment) {
    if (this.state.reason !== '') {
      axios.post('/api/rejectappointment', {
        appointmentId: appointment.appointmentId,
        patientUser: appointment.patientUser,
        message: this.state.reason
      })
      .then(response => {
        return axios.get('/api/doctorappointment');
      })
      .then(response => {
        this.setState({
          appointments: [...response.data]
        });
      })
      .catch(error => {
        console.log(error);
      });
    } else {
      alert('Please enter a reason for rejecting');
    }
  }

  handleReasonChange(e) {
    this.setState({
      reason: e.target.value
    });
  }

  findTimeDifference(time) {
    const momentObject = moment(time, 'MM/DD/YYYY, hh:mm:ss A');
    return moment().diff(momentObject, 'minutes');
  }

  // Map function for future appointments
  currentAppointmentsMap(appointment, index) {
    if (this.findTimeDifference(appointment.time) < 0 && appointment.approved && !appointment.canceled) {
      return (
        <div key={index}>
          <div>Time: {appointment.time}</div>
        </div>
      );
    }
  }

  // Map function for pending appointments
  pendingAppointmentsMap(appointment, index) {
    if (this.findTimeDifference(appointment.time) < 0 && !appointment.approved && !appointment.canceled) {
      return (
        <div key={index}>
          <div>Time: {appointment.time}</div>
          <button onClick={this.handleApproveClick.bind(this, appointment)}>Approve</button>
          <button onClick={this.handleRejectClick.bind(this, appointment)}>Reject</button>
          <input type='text' value={this.state.reason} onChange={this.handleReasonChange.bind(this)} placeholder='Reason for rejection' />
        </div>
      );
    }
  }

  // Map function for canceled appointments
  canceledAppointmentsMap(appointment, index) {
    if (appointment.canceled) {
      return (
        <div key={index}>
          <div>Time: {appointment.time}</div>
          <div>Reason for canceling: {appointment.message}</div>
        </div>
      );
    }
  }

  // Map function for past appointments
  pastAppointmentsMap(appointment, index) {
    if (this.findTimeDifference(appointment.time) > 0) {
      return (
        <div key={index}>
          <div>Time: {appointment.time}</div>
        </div>
      );
    }
  }

  render() {
    return (
      <div>

        <div>
          <h2>Patient Details</h2>
          <div>Name: {this.state.name}</div>
          <div>Age: {this.state.age}</div>
          <div>Email: {this.state.email}</div>
          <div>Address: {this.state.address}</div>
          <div>Phone: {this.state.phone}</div>
        </div>

        <div>
          <h2>Appointments</h2>

          <div>
            <h3>Make a new appointment</h3>
            <Datetime isValidDate={this.validDateTime} onChange={this.handleDatetimeChange.bind(this)} />
            <button onClick={this.handleMakeAppointment.bind(this)}>Make a new appointment</button>
          </div>

          { this.state.appointments &&
            <div>
              <div>
                <h3>Upcoming Appointments</h3>
                { this.state.appointments.map(this.currentAppointmentsMap.bind(this)) }
              </div>

              <div>
                <h3>Pending Appointments</h3>
                { this.state.appointments.map(this.pendingAppointmentsMap.bind(this)) }
              </div>

              <div>
                <h3>Canceled Appointments</h3>
                { this.state.appointments.map(this.canceledAppointmentsMap.bind(this)) }
              </div>

              <div>
                <h3>Past Appointments</h3>
                { this.state.appointments.map(this.pastAppointmentsMap.bind(this)) }
              </div>
            </div>
          }
        </div>

      </div>
    );
  }
}