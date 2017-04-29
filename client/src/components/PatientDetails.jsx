import React from 'react';
import axios from 'axios';
import Datetime from 'react-datetime';
import moment from 'moment';
import Dropzone from 'react-dropzone';

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
      reason: '',
      files: null
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

    axios.get('/api/doctorfiles')
    .then(response => {
      this.setState({
        files: [...response.data]
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
        time: this.state.appointmentDateTime
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
      appointmentId: appointment.appointmentId
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

  // Disable dates before today
  validDateTime(current) {
    const yesterday = Datetime.moment().subtract(1, 'day');
    
    return current.isAfter(yesterday);
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

  onDrop(files) {
    const data = new FormData();

    data.append('file', files[0], files[0].name);
    axios.post('/api/doctorfiles', data)
    .then(response => {
      if (!response.data.uploaded) {
        alert(response.data.message);
      }
      return axios.get('/api/doctorfiles');
    })
    .then(response => {
      this.setState({
        files: [...response.data]
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  handleRemoveAttachment(file) {
    axios.post('/api/doctordeletefile', {
      filename: file.filename,
      path: file.path
    })
    .then(response => {
      return axios.get('/api/doctorfiles');
    })
    .then(response => {
      this.setState({
        files: [...response.data]
      });
    })
    .catch(error => {
      console.log(error);
    });
  }

  filesMap(file, index) {
    return (
      <div key={index}>
        Filename: {file.filename}
        <a href={file.path} download>Download</a>
        <button onClick={this.handleRemoveAttachment.bind(this, file)}>Remove</button>
      </div>
    );
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

        <div>
          <h2>Attachments</h2>

          { this.state.files && 
            this.state.files.map(this.filesMap.bind(this))
          }
          <div>Upload new files: </div>
          <Dropzone onDrop={this.onDrop.bind(this)}>
            Drag a file here or click to upload
          </Dropzone>
        </div>

      </div>
    );
  }
}