import React from 'react';
import { Link } from 'react-router';

export default class Landing extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="landing-container">
        <div className="landing-content">
          <h1>Welcome</h1>
          <Link className="login-button" to="/login">Login</Link>
        </div>
      </div>
    );
  }
}