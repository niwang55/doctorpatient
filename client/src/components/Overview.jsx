import React from 'react';
import axios from 'axios';
import Datetime from 'react-datetime';

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
      doctors: null,
      selectedDoctor: null
    };
  }

  componentWillMount() {
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

    axios.get('/api/doctors')
      .then(response => {
        this.setState({
          doctors: [...response.data],
          selectedDoctor: response.data[0].username
        });
      });

    axios.get('/api/patientappointment')
      .then(response => {
        console.log(response);
      });
  }

  handleDatetimeChange(e) {
    this.setState({
      appointmentDateTime: e._d.toLocaleString()
    });
  }

  handleDoctorChange(e) {
    this.setState({
      selectedDoctor: e.target.value
    });
  }

  handleMakeAppointment() {
    if (this.state.appointmentDateTime) {

      // Post to api with appointment time and selected doctor
      axios.post('/api/patientappointment', {
        time: this.state.appointmentDateTime,
        doctor: this.state.selectedDoctor
      })
      .catch(error => console.log(error));

    } else {
      alert('Please choose a time');
    }
  }

  render() {
    // Disable dates before today
    const yesterday = Datetime.moment().subtract(1, 'day');
    const valid = current => {
      return current.isAfter(yesterday);
    };

    return (
      <div>

        <div>
          <h2>{this.state.name}</h2>
          <div>Age: {this.state.age}</div>
          <div>Email: {this.state.email}</div>
          <div>Address: {this.state.address}</div>
          <div>Phone: {this.state.phone}</div>
        </div>

        <div>
          <h2>Appointments</h2>
          <Datetime isValidDate={valid} onChange={this.handleDatetimeChange.bind(this)} />
          <select onChange={this.handleDoctorChange.bind(this)}>
            { this.state.doctors &&
              this.state.doctors.map((doctor, index) => (
                <option key={index} value={doctor.username}>{doctor.name}</option>
              ))
            }
          </select>
          <button onClick={this.handleMakeAppointment.bind(this)}>Make a new appointment</button>
        </div>

      </div>
    );
  }
}