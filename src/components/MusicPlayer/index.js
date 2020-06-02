import React, { Component } from 'react';

import Draggable from 'react-draggable';

import Style from './style.module.scss';

export default class MusicPlayer extends Component {
  render() {
    return (
      <Draggable bounds="parent">
        <div
          style={{
            width: '280px',
            height: '200px',
            background: '#f9f9f9',
            position: 'absolute',
            zIndex: '10000',
            imageRendering: 'pixelated',
            border: '1px solid #000',
          }}
        >
          <div style={{ width: '100%' }}>
            <div className={Style.dragHeader}>
              <div className={Style.closeIcon}>x</div>
              <span className={Style.spacer}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <h2 className={Style.fmTitle}>Dripverse FM</h2>
            </div>
          </div>
        </div>
      </Draggable>
    );
  }
}
