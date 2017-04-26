import React from 'react';
import { Link } from 'react-router';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Doctor/Patient</h1>

        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>

        { this.props.children }
      </div>
    );
  }
}