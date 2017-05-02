import React from 'react';
import axios from 'axios';
import Datetime from 'react-datetime';
import moment from 'moment';
import Dropzone from 'react-dropzone';

export default class Overview extends React.Component {
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
      doctors: null,
      selectedDoctorUser: null,
      files: null
    };
  }

  // When component loads, get information about the patient and setState
  componentWillMount() {
    // Basic information
    axios.get('/api/overview')
    .then(response => {
      let patient = response.data;
      this.setState({
        username: patient.username,
        name: patient.name,
        age: patient.age,
        email: patient.email,
        address: patient.address,
        phone: patient.phone,
      });
    });

    // Get the list of doctors
    axios.get('/api/doctors')
    .then(response => {
      this.setState({
        doctors: [...response.data],
        selectedDoctorUser: response.data[0].username,
      });
    });

    // Get the list of appointments related to current patient
    axios.get('/api/patientappointment')
    .then(response => {
      this.setState({
        appointments: [...response.data]
      });
    });

    // Get the list of files related to the current patient
    axios.get('/api/patientfiles')
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

  handleDoctorChange(e) {
    this.setState({
      selectedDoctorUser: e.target.value
    });
  }

  handlePurposeChange(e) {
    this.setState({
      appointmentPurpose: e.target.value
    });
  }

  // When the user makes an appointment, send a post request to the server
  handleMakeAppointment(e) {
    e.preventDefault();

    if (this.state.appointmentDateTime && this.state.appointmentPurpose !== '') {
      // Post to api with appointment time, purpose, and selected doctor
      axios.post('/api/patientappointment', {
        time: this.state.appointmentDateTime,
        purpose: this.state.appointmentPurpose,
        doctorUser: this.state.selectedDoctorUser,
      })
      .then(response => {
        // After posting a new apointment, get the list of appointments again to rerender
        return axios.get('/api/patientappointment');
      })
      .then(response => {
        this.setState({
          appointments: [...response.data]
        });
      })
      .catch(error => console.log(error));

    } else {
      // If the user did not enter a date/purpose, alert them
      alert('Please select a date and include the purpose of the appointment');
    }
  }

  // Disable dates before today
  validDateTime(current) {
    const yesterday = Datetime.moment().subtract(1, 'day');
    
    return current.isAfter(yesterday);
  }

  // Function to see if appointments are in the past
  findTimeDifference(time) {
    const momentObject = moment(time, 'MM/DD/YYYY, hh:mm:ss A');
    return moment().diff(momentObject, 'minutes');
  }

  handleCancelAppointment(appointment) {
    axios.post('/api/cancelappointment', {
      appointmentId: appointment.appointmentId
    })
    .then(response => {
      return axios.get('/api/patientappointment');
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

  // Map function for future appointments
  currentAppointmentsMap(appointment, index) {
    if (this.findTimeDifference(appointment.time) < 0 && appointment.approved && !appointment.canceled) {
      return (
        <div key={index} className="appointment">
          <div>Time: {appointment.time}, with Dr. {appointment.doctorName}</div>
          <div>Purpose: {appointment.purpose}</div>
          <button onClick={this.handleCancelAppointment.bind(this, appointment)}>Cancel</button>
        </div>
      );
    }
  }

  // Map function for pending appointments
  pendingAppointmentsMap(appointment, index) {
    if (this.findTimeDifference(appointment.time) < 0 && !appointment.approved && !appointment.canceled) {
      return (
        <div key={index} className="appointment">
          <div>Time: {appointment.time}, with Dr. {appointment.doctorName}</div>
          <div>Purpose: {appointment.purpose}</div>
        </div>
      );
    }
  }

  // Map function for canceled appointments
  canceledAppointmentsMap(appointment, index) {
    if (appointment.canceled) {
      return (
        <div key={index} className="appointment">
          <div>Time: {appointment.time}, with Dr. {appointment.doctorName}</div>
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
          <div>Time: {appointment.time}, with Dr. {appointment.doctorName}</div>
          <div>Purpose: {appointment.purpose}</div>
        </div>
      );
    }
  }

  // Map function for attachments
  filesMap(file, index) {
    return (
      <div className="list-files" key={index}>
        <div>Name: {file.filename}</div>
        <div><a href={file.path} download>DL: <i className="fa fa-download" aria-hidden="true"></i>
</a></div>
      </div>
    );
  }

  // Function for when user uploads a file
  onDrop(files) {
    const data = new FormData();

    data.append('file', files[0], files[0].name);
    axios.post('/api/patientfiles', data)
    .then(response => {
      if (!response.data.uploaded) {
        alert(response.data.message);
      }
      return axios.get('/api/patientfiles');
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

  render() {

    return (
      <div className="patient-details">

        <div className="patient-details-col patient-details-info">
          <h2>{this.state.name}</h2>
          <div>Age: {this.state.age}</div>
          <div>Email: {this.state.email}</div>
          <div>Address: {this.state.address}</div>
          <div>Phone: {this.state.phone}</div>
        </div>

        <div className="patient-details-col patient-details-appointments">
          <h2>Appointments</h2>

          <div className="appointment-maker">
            <h3>Request a new appointment <i className="fa fa-calendar" aria-hidden="true"></i></h3>
            <div className="date-picker">
              <Datetime inputProps={{placeholder: 'Click to pick a date', className: 'calendar'}} isValidDate={this.validDateTime} onChange={this.handleDatetimeChange.bind(this)} />
              <button onClick={this.handleMakeAppointment.bind(this)}>Request</button>
            </div>
            <div className="purpose-doctor-picker">
              <textarea className="appointment-purpose" onChange={this.handlePurposeChange.bind(this)} placeholder="What is the purpose of this appointment?" />
              <span>Pick a doctor: </span>
              <select onChange={this.handleDoctorChange.bind(this)}>
                { this.state.doctors &&
                  this.state.doctors.map((doctor, index) => (
                    <option key={index} value={doctor.username}>{doctor.name}</option>
                  ))
                }
              </select>
            </div>
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
            <h2>Attachments</h2>

            <div>Upload new files: </div>
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