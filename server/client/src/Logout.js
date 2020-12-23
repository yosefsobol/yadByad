import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Logout extends Component {
  state = { redirect: true }
  constructor(props) {
    super(props);
    props.setUser(null);
    sessionStorage.clear();
  }
  render() {
    return <Redirect to='/' />
  }
}

export default Logout; 