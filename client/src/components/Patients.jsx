import React from 'react';
import axios from 'axios';

export default class Patients extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: []
    };
  }

  componentWillMount() {
    axios.get('/api/patients')
      .then(response => {
        this.setState({
          patients: [...response.data]
        });
      });
  }

  handleClick(index) {
    const clickedPatient = this.state.patients[index];
    console.log(clickedPatient);
  }

  render() {
    return (
      <div>
        <h2>Patients</h2>
        {
          this.state.patients.map((patient, index) => (
            <div key={index} onClick={this.handleClick.bind(this, index)}>{patient.name}</div>
          ))
        }
      </div>
    );
  }
}