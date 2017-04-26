import React from 'react';
import axios from 'axios';
import { browserHistory } from 'react-router';

export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: ''
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

  handleLogin(e) {
    e.preventDefault();

    axios.post('/api/login', {
      username: this.state.username,
      password: this.state.password
    })
    .then(response => {
      const location = this.props.location;
      if (response.data.authenticated) {
        browserHistory.push('/patients');
      } else {
        console.log(response.data.message);
      }
    })
    .catch(error => {
      console.log('Error in login: ', error);
      browserHistory.push('/login');
    });

  }

  render() {
    return (
      <div>
        <h1>LOGIN</h1>

        <form>
          <input type='text' value={this.state.username} onChange={this.handleUsernameChange.bind(this)} placeholder='Username' />
          <input type='password' value={this.state.password} onChange={this.handlePasswordChange.bind(this)} placeholder='Password' />
          <button onClick={this.handleLogin.bind(this)}>LOGIN</button>
        </form>
      
      </div>
    );
  }
}