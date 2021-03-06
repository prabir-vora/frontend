import React, { Component } from 'react';
import MainNavBar from '../MainNavBar';
import MainFooter from '../MainFooter';
import { ClipLoader } from 'react-spinners';

export default class LoadingScreen extends Component {
  render() {
    return (
      <div style={{ backgroundColor: 'black' }}>
        <MainNavBar />
        <div
          style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            padding: '5%',
          }}
        >
          <ClipLoader color={'#ffffff'} loading={true} />
        </div>
        <MainFooter />
      </div>
    );
  }
}
