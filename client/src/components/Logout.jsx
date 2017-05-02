import React from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';

export default class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  // Send a request to the server to logout, redirect back to the landing page
  handleLogout() {
    axios.get('/api/logout')
    .catch(error => {
      console.log(error);
    });

    browserHistory.push('/');
  }

  render() {
    return (
      <div className="logout">
        <div className="logout-button-col">
          <Link className="logout-button" onClick={this.handleLogout.bind(this)}>Logout</Link>
        </div>
        <div className="main-content">
          {
            this.props.children
          }
        </div>
      </div>
    );
  }
}