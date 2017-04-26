import React from 'react';
import axios from 'axios';

export default class Overview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {
    axios.get('/api/overview')
      .then(response => {

      });
  }

  render() {
    return (
      <div>
        OVERVIEW
      </div>
    );
  }
}