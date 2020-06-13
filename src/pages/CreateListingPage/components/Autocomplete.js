import React, { Component } from 'react';
import { connectAutoComplete, connectHighlight } from 'react-instantsearch-dom';
import AutoSuggest from 'react-autosuggest';

import { Img } from 'fields';

import Style from './style.module.scss';

// import theme from './theme.css';

const theme = {
  container: {
    position: 'relative',
  },
  input: {
    border: '1px solid black',
    backgroundColor: 'white',
    display: 'block',
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    maxWidth: '400px',
    borderRadius: '6px',
    outline: 'none',
    height: '40px',
  },
  inputFocused: {
    outline: 'none',
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  suggestionsContainer: {
    display: 'none',
  },
  suggestionsContainerOpen: {
    display: 'block',
    position: 'absolute',
    top: 51,
    width: 280,
    border: '1px solid #aaa',
    backgroundColor: '#fff',
    fontFamily: 'Baskerville',
    fontWeight: 300,
    fontSize: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    zIndex: 2,
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  suggestion: {
    cursor: 'pointer',
    padding: '10px 20px',
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd',
  },
};

function Highlight(props) {
  const { hit } = props;
  const { original_image_url, name, brand, colorway } = hit;
  return (
    <div className={Style.highlightItem}>
      <Img
        src={original_image_url}
        alt={`${name} image`}
        className={Style.highlightImage}
      />
      <div className={Style.highlighDescription}>
        <p className={Style.highlightName}>{name}</p>
        <div className={Style.detailsContainer}>
          <p className={Style.highlightBrand}>{brand.name}</p>
          <p className={Style.highlightColorway}>{colorway}</p>
        </div>
      </div>
    </div>
  );
}

const CustomHighlight = connectHighlight(Highlight);

class Autocomplete extends Component {
  state = {
    value: this.props.currentRefinement,
  };

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.props.refine(value);
  };

  onSuggestionsClearRequested = () => {
    console.log('cleared');
    this.props.refine();
  };

  getSuggestionValue(hit) {
    return hit.name;
  }

  shouldRenderSuggestions(value) {
    return value.trim().length > 2;
  }

  renderSuggestion(hit) {
    return <CustomHighlight attribute="name" hit={hit} tagName="mark" />;
  }

  renderInputComponent = inputProps => {
    return (
      <div>
        <input {...inputProps} className={Style.productSearchInput} />
      </div>
    );
  };

  renderSuggestionsContainer = ({ containerProps, children, query }) => {
    const { id, role, key, ref } = containerProps;

    return (
      <div
        className={Style.suggestionsContainer}
        id={id}
        role={role}
        key={key}
        ref={ref}
      >
        {children}
      </div>
    );
  };

  onSuggestionSelected = (_, { suggestion }) => {
    this.props.onProductSelection(suggestion);
  };

  render() {
    const { hits } = this.props;
    const { value } = this.state;

    const inputProps = {
      placeholder: 'Search for a product...',
      onChange: this.onChange,
      value,
    };

    return (
      <AutoSuggest
        theme={theme}
        suggestions={hits}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={this.renderInputComponent}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        onSuggestionSelected={this.onSuggestionSelected}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
      />
    );
  }
}

export default connectAutoComplete(Autocomplete);
