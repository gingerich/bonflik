/*
 * Home Actions
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
  LOAD_MOVIE,
  LOAD_MOVIE_SUCCESS,
  LOAD_MOVIE_ERROR
} from './constants';

export function loadMovie(id) {
  return {
    type: LOAD_MOVIE,
    id,
  };
}

export function movieLoaded(movie) {
  return {
    type: LOAD_MOVIE_SUCCESS,
    movie,
  };
}

export function movieLoadingError(error) {
  return {
    type: LOAD_MOVIE_ERROR,
    error,
  };
}
