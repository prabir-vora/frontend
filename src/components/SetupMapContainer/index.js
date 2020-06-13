import React, { Component } from 'react';

import { withGoogleMap, GoogleMap, Circle } from 'react-google-maps';

class MapContainer extends Component {
  render() {
    console.log(this.props);
    return (
      <GoogleMap
        defaultZoom={13}
        center={this.props._geoloc}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
        // style={{ width: '500px', height: '200px' }}
      >
        <Circle
          radius={1000}
          center={this.props._geoloc}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
          }}
        />
      </GoogleMap>
    );
  }
}

export default withGoogleMap(MapContainer);
