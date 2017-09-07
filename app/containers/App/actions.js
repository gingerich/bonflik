/*
 * App Actions
 *
 * Actions change things in your application
 * Since this boilerplate uses a uni-directional data flow, specifically redux,
 * we have these actions which are the only way your application interacts with
 * your application state. This guarantees that your state is up to date and nobody
 * messes it up weirdly somewhere.
 *
 * To add a new Action:
 * 1) Import your constant
 * 2) Add a function like this:
 *    export function yourAction(var) {
 *        return { type: YOUR_ACTION_CONSTANT, var: var }
 *    }
 */

import {
  SEARCH_MOVIES,
  SEARCH_MOVIES_SUCCESS,
  SEARCH_MOVIES_ERROR,
} from './constants';

/**
 * Load the repositories, this action starts the request saga
 *
 * @return {object} An action object with a type of SEARCH_MOVIES
 */
export function searchMovies() {
  return {
    type: SEARCH_MOVIES,
  };
}

/**
 * Dispatched when the repositories are loaded by the request saga
 *
 * @param  {array} movies The repository data
 *
 * @return {object}      An action object with a type of SEARCH_MOVIES_SUCCESS passing the movies
 */
export function moviesLoaded(movies) {
  return {
    type: SEARCH_MOVIES_SUCCESS,
    movies
  };
}

/**
 * Dispatched when loading the repositories fails
 *
 * @param  {object} error The error
 *
 * @return {object}       An action object with a type of SEARCH_MOVIES_ERROR passing the error
 */
export function movieLoadingError(error) {
  return {
    type: SEARCH_MOVIES_ERROR,
    error,
  };
}
