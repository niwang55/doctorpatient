import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      message: null
    };
  }

  handleUsernameChange(e) {
    this.setState({
      username: e.target.value
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value
    }); 
  }

  // Sends a post request to the server with username and password,
  // server checks to see if user is valid
  handleLogin(e) {
    e.preventDefault();

    axios.post('/api/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then(response => {
      if (response.data.authenticated) {
        // if the user is a doctor, redirects to /patients,
        // if user is patient, redirects to /overview
        if (response.data.isDoctor) {
          browserHistory.push('/patients');
        } else {
          browserHistory.push('/overview');
        }
      } else {
        // Set a message for failed login
        this.setState({
          message: response.data.message
        });
      }
    })
    .catch(error => {
      console.log('Error in login: ', error);
      browserHistory.push('/login');
    });

  }

  render() {
    return (
      <div className="login">

        <div className="login-form">

          <form>
            <input type='text' value={this.state.username} onChange={this.handleUsernameChange.bind(this)} placeholder='Username' />
            <input type='password' value={this.state.password} onChange={this.handlePasswordChange.bind(this)} placeholder='Password' />
            <button onClick={this.handleLogin.bind(this)}>LOGIN</button>
          </form>

          <div className="login-message">
            { this.state.message &&
              this.state.message
            }
          </div>

        </div>
      
      </div>
    );
  }
}