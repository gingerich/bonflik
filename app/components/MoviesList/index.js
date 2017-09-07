import React from 'react';
import PropTypes from 'prop-types';

import List from 'components/List';
import ListItem from 'components/ListItem';
import LoadingIndicator from 'components/LoadingIndicator';
import MovieListItem from 'containers/MovieListItem';

function MoviesList({ loading, error, movies }) {
  if (loading) {
    return <List component={LoadingIndicator} />;
  }

  if (error !== false) {
    const ErrorComponent = () => (
      <ListItem item={'Something went wrong, please try again!'} />
    );
    return <List component={ErrorComponent} />;
  }

  if (movies !== false) {
    return <List items={movies} component={MovieListItem} />;
  }

  return null;
}

MoviesList.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.any,
  movies: PropTypes.any
};

export default MoviesList;
