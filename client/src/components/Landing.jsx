import React from 'react';
import { Link } from 'react-router';

const Landing = () => (
  <div className="landing-container">
    <div className="landing-content">
      <h1>Welcome</h1>
      <Link className="login-button" to="/login">Login</Link>
    </div>
  </div>
);

export default Landing;