import React, { Component } from 'react';
import Rheostat from 'rheostat';
import 'rheostat/initialize';

import './index.css';

export default class index extends Component {
  render() {
    return (
      <div
        style={{ marginTop: '30px', display: 'flex', flexDirection: 'column' }}
      >
        <Rheostat
          onChange={this.props.onChange}
          min={this.props.min}
          max={this.props.max}
          values={this.props.values}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
          }}
        >
          <p style={{ fontSize: '12px' }}>${this.props.values[0]}</p>
          <p style={{ fontSize: '12px' }}>${this.props.values[1]}</p>
        </div>
      </div>
    );
  }
}
