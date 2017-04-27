import React from 'react';
import axios from 'axios';

export default class PatientDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
      name: null,
      age: null,
      email: null,
      address: null,
      phone: null
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
          phone: patient.phone,
        });
      });
  }

  render() {
    return (
      <div>
        <h2>Patient Details</h2>
        <div>Name: {this.state.name}</div>
        <div>Age: {this.state.age}</div>
        <div>Email: {this.state.email}</div>
        <div>Address: {this.state.address}</div>
        <div>Phone: {this.state.phone}</div>
      </div>
    );
  }
}