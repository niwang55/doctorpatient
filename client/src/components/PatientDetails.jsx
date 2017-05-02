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
      appointmentPurpose: '',
      cancelReason: '',
      files: null
    };
  }

  // When component loads, get information about selected patient
  componentWillMount() {
    // Basic info
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

    // Get list of appointments
    axios.get('/api/doctorappointment')
    .then(response => {
      this.setState({
        appointments: [...response.data]
      });
    });

    // Get list of files
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

  handlePurposeChange(e) {
    this.setState({
      appointmentPurpose: e.target.value
    });
  }

  handleMakeAppointment(e) {
    e.preventDefault();

    if (this.state.appointmentDateTime && this.state.appointmentPurpose !== '') {
      // Post to api with appointment time, purpose, and selected doctor
      axios.post('/api/doctorappointment', {
        time: this.state.appointmentDateTime,
        purpose: this.state.appointmentPurpose
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
      alert('Please select a date and include the purpose of the appointment');
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
    if (this.state.cancelReason !== '') {
      axios.post('/api/rejectappointment', {
        appointmentId: appointment.appointmentId,
        cancelReason: this.state.cancelReason
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
      cancelReason: e.target.value
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
        <div key={index} className="appointment">
          <div>Time: {appointment.time}</div>
          <div>Purpose: {appointment.purpose}</div>
        </div>
      );
    }
  }

  // Map function for pending appointments
  pendingAppointmentsMap(appointment, index) {
    if (this.findTimeDifference(appointment.time) < 0 && !appointment.approved && !appointment.canceled) {
      return (
        <div key={index} className="appointment">
          <div>Time: {appointment.time}</div>
          <div>Purpose: {appointment.purpose}</div>
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
        <div key={index} className="appointment">
          <div>Time: {appointment.time}</div>
          <div>Purpose: {appointment.purpose}</div>
          <div>Reason for canceling: {appointment.cancelReason}</div>
        </div>
      );
    }
  }

  // Map function for past appointments
  pastAppointmentsMap(appointment, index) {
    if (this.findTimeDifference(appointment.time) > 0) {
      return (
        <div key={index} className="appointment">
          <div>Time: {appointment.time}</div>
          <div>Purpose: {appointment.purpose}</div>
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
      <div className="list-files" key={index}>
        <div>Name: {file.filename}</div>
        <div><a href={file.path} download>DL: <i className="fa fa-download" aria-hidden="true"></i>
</a></div>
        <div><button onClick={this.handleRemoveAttachment.bind(this, file)}>Remove</button></div>
      </div>
    );
  }

  render() {
    return (
      <div className="patient-details">

        <div className="patient-details-col patient-details-info">
          <h2><u>Patient Information</u></h2>
          <div>Name: {this.state.name}</div>
          <div>Age: {this.state.age}</div>
          <div>Email: {this.state.email}</div>
          <div>Address: {this.state.address}</div>
          <div>Phone: {this.state.phone}</div>
        </div>

        <div className="patient-details-col patient-details-appointments">
          <h2><u>Appointments</u></h2>

          <div className="appointment-maker">
            <h3>Make a new appointment <i className="fa fa-calendar" aria-hidden="true"></i></h3>
            <div className="date-picker">
              <Datetime inputProps={{placeholder: 'Click to pick a date', className: 'calendar'}} isValidDate={this.validDateTime} onChange={this.handleDatetimeChange.bind(this)} />
              <button onClick={this.handleMakeAppointment.bind(this)}>Make a new appointment</button>
            </div>
            <textarea className="appointment-purpose" onChange={this.handlePurposeChange.bind(this)} placeholder="What is the purpose of this appointment?" />
          </div>

          { this.state.appointments &&
            <div>
              <div className="appointment-container">
                <h3><u>Upcoming Appointments</u></h3>
                { this.state.appointments.map(this.currentAppointmentsMap.bind(this)) }
              </div>

              <div className="appointment-container">
                <h3><u>Pending Appointments</u></h3>
                { this.state.appointments.map(this.pendingAppointmentsMap.bind(this)) }
              </div>

              <div className="appointment-container">
                <h3><u>Canceled Appointments</u></h3>
                { this.state.appointments.map(this.canceledAppointmentsMap.bind(this)) }
              </div>

              <div className="appointment-container">
                <h3><u>Past Appointments</u></h3>
                { this.state.appointments.map(this.pastAppointmentsMap.bind(this)) }
              </div>
            </div>
          }
        </div>

        <div className="patient-details-col patient-details-attachments">
          <div>
            <h2><u>Attachments</u></h2>

            <div><h3>Upload new files:</h3></div>
            <Dropzone className="file-uploader" onDrop={this.onDrop.bind(this)}>
              <div>Drag a file here or click to upload</div>
              <i className="fa fa-upload fa-3x" aria-hidden="true"></i>
            </Dropzone>
          </div>

          <div>
            <h3>Files:</h3>
            { this.state.files &&
              this.state.files.map(this.filesMap.bind(this))
            }
          </div>

        </div>

      </div>
    );
  }
}