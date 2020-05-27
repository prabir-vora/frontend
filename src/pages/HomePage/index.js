import React, { Component } from 'react';

import MainNavBar from 'components/MainNavBar';

class HomePage extends Component {
  render() {
    return (
      <div style={{ width: '100%', backgroundColor: 'black' }}>
        <MainNavBar />
      </div>
    );
  }
}

export default HomePage;
