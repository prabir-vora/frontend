import React, { Component } from 'react';

import { Img } from 'fields';

export default class UserListings extends Component {
  renderResellItem = resellItem => {
    const {
      condition,
      size,
      images,
      askingPrice,
      availability,
      product,
    } = resellItem;

    console.log(resellItem);

    const { name } = product;
    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    return (
      <div
        style={{
          width: '60%',
          height: '120px',
          marginBottom: '20px',
          display: 'flex',
          background: '#222320',
          padding: '10px',
        }}
      >
        <Img
          src={images && images.length > 0 && images[0]}
          style={{
            width: '100px',
            height: '100px',
            backgroundColor: '#e0e0e0',
          }}
        />
        <div
          style={{
            color: 'white',
            fontSize: '12px',
            marginLeft: '30px',
            marginTop: '10px',
          }}
        >
          <div>
            <div style={{ marginBottom: '10px' }}>{name}</div>
            <div style={{ marginBottom: '10px' }}>
              Condition: {conditionMap[condition].label}
            </div>
            <div>Size: {size}</div>
          </div>

          <div style={{ marginTop: '20px', display: 'flex' }}>
            <div style={{ marginLeft: '10px' }}>
              Availability: {availability.join(', ')}
            </div>
          </div>
        </div>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: '20px' }}>
            <h2 style={{ color: 'white', margin: '10px' }}>${askingPrice}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              style={{
                width: '100px',
                height: '30px',
                background: '#938cfc',
                color: 'white',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              Edit
            </button>
            <button
              style={{
                width: '100px',
                height: '30px',
                background: '#938cfc',
                color: 'white',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              Share
            </button>
          </div>
        </div>
      </div>
    );
  };
  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {this.props.user.resellItems.map(this.renderResellItem)}
      </div>
    );
  }
}
