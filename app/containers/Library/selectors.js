/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';

const selectLibrary = (state) => state.get('library');

const makeSelectQuery = () => createSelector(
  selectLibrary,
  (libraryState) => libraryState.get('query')
);

export {
  selectLibrary,
  makeSelectQuery,
};
