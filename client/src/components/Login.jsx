import React from 'react';
import axios from 'axios';

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
      console.log(response);
    })
    .catch(error => {
      console.log(error);
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