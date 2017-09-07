import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import MovieDb from 'moviedb';
import throttle from 'lodash.throttle';
import { TextField } from 'material-ui';
import { ListItem, ListItemText } from 'material-ui/List';

import MoviePoster from 'components/MoviePoster';
import { TMDB_API_KEY } from './constants';
import theme from './theme.css';

const moviedb = MovieDb(TMDB_API_KEY);

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = (suggestion) => suggestion.title || suggestion.name;

// Use your imagination to render suggestions.
const renderSuggestion = (suggestion) => (
  <ListItem dense button key={suggestion.id}>
    <MoviePoster path={suggestion.poster_path} size={92} />
    <ListItemText primary={suggestion.title} />
  </ListItem>
);

const renderInputComponent = (inputProps) => <TextField {...inputProps} />;

class MovieLookup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      suggestions: [],
      isLoading: false
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
    if (this.props.onChange) {
      this.props.onChange(event, newValue);
    }
  };

  // Autosuggest will call this function every time you need to update suggestions.
  onSuggestionsFetchRequested = ({ value }) => {
    this.loadSuggestions(value);
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = (event, selected) => {
    if (this.props.onSuggestionSelected) {
      const { suggestion: { id } } = selected;
      const pList = [
        new Promise((resolve, reject) => {
          moviedb.movieInfo({ id }, (err, data) => {
            if (err) return reject(err);
            resolve(data);
          });
        }),
        new Promise((resolve, reject) => {
          moviedb.movieCredits({ id }, (err, data) => {
            if (err) return reject(err);
            resolve(data.cast);
          });
        })
      ];
      Promise.all(pList).then(([movieInfo, movieCast]) => {
        movieInfo.cast = movieCast
          .sort((a, b) => a.order - b.order)
          .map((member) => member.name);
        this.props.onSuggestionSelected(movieInfo, selected);
      });
    }
  };

  loadSuggestions = throttle((query) => {
    // Cancel the previous request
    this.loadSuggestions.cancel();

    this.setState({
      isLoading: true
    });

    moviedb.searchMulti({ query }, (error, { results }) => {
      const isLoading = false;
      if (error) {
        return this.setState({ isLoading, error });
      }
      const suggestions = results.filter((i) => i.media_type === 'movie');
      this.setState({ isLoading, suggestions });
    });
  }, 500);

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      id: 'title',
      label: 'Movie title',
      placeholder: 'Search for a movie title',
      value,
      onChange: this.onChange,
      ...this.props.inputProps
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        onSuggestionSelected={this.onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderInputComponent={renderInputComponent}
      />
    );
  }
}

MovieLookup.propTypes = {
  inputProps: PropTypes.object,
  onSuggestionSelected: PropTypes.func,
  onChange: PropTypes.func
};

export default MovieLookup;
