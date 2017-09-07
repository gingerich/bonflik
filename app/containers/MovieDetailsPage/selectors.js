/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectMovie = (state) => state.get('movie');

const makeSelectMovie = () => createSelector(
  selectMovie,
  (movieDetailState) => movieDetailState.get('movie')
);

const makeSelectMovieLoading = () => createSelector(
  selectMovie,
  (movieDetailState) => movieDetailState.get('loading')
);

const makeSelectMovieLoadError = () => createSelector(
  selectMovie,
  (movieDetailState) => movieDetailState.get('error')
);

export {
  selectMovie,
  makeSelectMovie,
  makeSelectMovieLoading,
  makeSelectMovieLoadError
};
