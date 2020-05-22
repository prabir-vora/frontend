import React, { Component } from 'react';
import moment from 'moment';

export default class ItemPurchased extends Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '32px',
          textAlign: 'center',
        }}
      >
        <h2>Congrats. Your Order was successful.</h2>
        <br />
        {this.props.purchased_at && (
          <div>
            Item was purchased on {moment(this.props.purchased_at).format()}
          </div>
        )}
      </div>
    );
  }
}
