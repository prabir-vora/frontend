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
    backgroundColor: 'white',
    display: 'block',
    width: '100%',
    padding: '16px',
    fontSize: '16px',
    outline: 'none',
    height: '40px',
    fontFamily: 'Baskerville',
    borderRadius: '0px',
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
    width: '100%',
    maxWidth: '100%',
  },
  suggestion: {
    cursor: 'pointer',
    boxSizing: 'border-box',
    width: '100%',
    // height: '120px',
    display: 'flex',
    alignItems: 'center',
  },
  suggestionHighlighted: {
    backgroundColor: '#ddd',
  },
};

function Highlight(props) {
  const { hit } = props;
  const { original_image_url, name, brand_name, colorway } = hit;
  return (
    <div className={Style.highlightItem}>
      <Img
        src={original_image_url}
        alt={`${name} image`}
        className={Style.highlightImage}
      />
      <div className={Style.highlighDescription}>
        <p className={Style.highlightBrand}>{brand_name}</p>
        <p className={Style.highlightName}>{name}</p>
        <p className={Style.highlightColorway}>{colorway}</p>
      </div>
    </div>
  );
}

const CustomHighlight = connectHighlight(Highlight);

class SearchInput extends Component {
  state = {
    value: this.props.currentRefinement,
  };

  onChange = (event, { newValue }) => {
    // this.setState({ value: newValue });

    this.props.onChange(newValue);
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
    const { hits, value } = this.props;
    // const { value } = this.state;

    const inputProps = {
      placeholder: 'Search Product, Brand, Designer, SKU ...',
      onChange: this.onChange,
      value,
      autoFocus: true,
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

export default connectAutoComplete(SearchInput);
