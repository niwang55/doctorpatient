import React from 'react';
import { Link, browserHistory } from 'react-router';
import axios from 'axios';

export default class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogout() {
    axios.get('/api/logout')
    .catch(error => {
      console.log(error);
    });

    browserHistory.push('/');
  }

  render() {
    return (
      <div>
        <Link onClick={this.handleLogout.bind(this)}>Logout</Link>
        {
          this.props.children
        }
      </div>
    );
  }
}