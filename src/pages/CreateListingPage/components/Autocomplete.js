import React, { Component } from 'react';
import { connectAutoComplete, connectHighlight } from 'react-instantsearch-dom';
import AutoSuggest from 'react-autosuggest';

import { Img } from 'fields';

import Style from './style.module.scss';

function Highlight(props) {
  const { hit } = props;
  const { original_image_url, name } = hit;
  return (
    <div className={Style.highlightItem}>
      <Img
        src={original_image_url}
        alt={`${name} image`}
        className={Style.highlightImage}
      />
      <div className={Style.highlighDescription}>
        <p className={Style.highlightName}>{name}</p>
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
