import React from 'react';
import PropTypes from 'prop-types';
import { classnames } from './helper';

import './index.css';

import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      errorMessage: '',
      latitude: null,
      longitude: null,
      isGeocoding: false,
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.setState({
      address: this.props.address || '',
      latitude: this.props.latitude || '',
      longitude: this.props.longitude || '',
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.address !== this.props.address) {
      this.setState({
        address: this.props.address || '',
        latitude: this.props.latitude || '',
        longitude: this.props.longitude || '',
      });
    }
  }

  handleChange = address => {
    this.setState({
      address,
      latitude: null,
      longitude: null,
      errorMessage: '',
    });
  };

  handleSelect = address => {
    this.setState({ isGeocoding: true, address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        this.props.onSelectLocation(address, lat, lng);
        this.setState({
          latitude: lat,
          longitude: lng,
          isGeocoding: false,
        });
      })
      .catch(error => {
        this.setState({ isGeocoding: false });
        console.log('error', error);
      });
  };

  handleCloseClick = () => {
    this.setState({
      address: '',
      latitude: null,
      longitude: null,
    });
  };

  handleError = (status, clearSuggestions) => {
    console.log('Error from Google Maps API', status); // eslint-disable-line no-console
    this.setState(
      { address: '', latitude: null, longitude: null, errorMessage: status },
      () => {
        clearSuggestions();
      },
    );
  };

  render() {
    const { address, errorMessage } = this.state;
    console.log(address);
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <PlacesAutocomplete
          onChange={this.handleChange}
          value={address}
          onSelect={this.handleSelect}
          onError={this.handleError}
          shouldFetchSuggestions={address.length > 2}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps }) => {
            return (
              <div className="Demo__search-bar-container">
                <div className="Demo__search-input-container">
                  <input
                    {...getInputProps({
                      placeholder:
                        'Search by town/city, neighbourhood or postcode.',
                      className: 'Demo__search-input',
                    })}
                  />
                  {this.state.address.length > 0 && (
                    <button
                      className="Demo__clear-button"
                      onClick={this.handleCloseClick}
                    >
                      x
                    </button>
                  )}
                </div>
                {suggestions.length > 0 && (
                  <div className="Demo__autocomplete-container">
                    {suggestions.map(suggestion => {
                      const className = classnames('Demo__suggestion-item', {
                        'Demo__suggestion-item--active': suggestion.active,
                      });

                      return (
                        /* eslint-disable react/jsx-key */
                        <div
                          {...getSuggestionItemProps(suggestion, { className })}
                        >
                          <strong>
                            {suggestion.formattedSuggestion.mainText}
                          </strong>{' '}
                          <small>
                            {suggestion.formattedSuggestion.secondaryText}
                          </small>
                        </div>
                      );
                      /* eslint-enable react/jsx-key */
                    })}
                  </div>
                )}
              </div>
            );
          }}
        </PlacesAutocomplete>
      </div>
    );
  }
}

export default LocationSearchInput;

LocationSearchInput.propTypes = {
  address: PropTypes.string,
  onSelectLocation: PropTypes.func,
};
