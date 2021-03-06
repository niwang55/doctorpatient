import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class Patients extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: [],
      searchTerm: '',
      filteredPatients: []
    };
  }

  componentWillMount() {
    // Get list of patients
    axios.get('/api/patients')
      .then(response => {
        this.setState({
          patients: [...response.data],
          filteredPatients: [...response.data]
        });
      });
  }

  // When doctor clicks on a patient, change currentPatient and redirect to that patient's detail page
  handleClick(patient) {
    axios.post('/api/currentpatient', {
      username: patient.username,
      name: patient.name
    })
    .catch(error => console.log(error));

    browserHistory.push('/patientdetails');
  }

  // When the search bar is updated, refilter the array to only include patients that are searched for
  handleSearchChange(e) {
    const filteredPatients = this.state.patients.filter(patient => patient.name.toLowerCase().includes(e.target.value));
    this.setState({
      filteredPatients: filteredPatients
    });
  }

  render() {
    return (
      <div className="patients">

        <h2><u>Patients</u></h2>
        <p>Click on a patient to see details</p>

        <input type='text' placeholder='Search for a patient by name' onChange={this.handleSearchChange.bind(this)} />

        {
          this.state.filteredPatients.map((patient, index) => (
            <div className='patient-name' key={index} onClick={this.handleClick.bind(this, patient)}><i className="fa fa-address-card" aria-hidden="true"></i> {patient.name}</div>
          ))
        }

      </div>
    );
  }
}