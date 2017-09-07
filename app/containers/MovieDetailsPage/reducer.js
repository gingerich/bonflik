/*
 * HomeReducer
 *
 * The reducer takes care of our data. Using actions, we can change our
 * application state.
 * To add a new action, add it to the switch statement in the reducer function
 *
 * Example:
 * case YOUR_ACTION_CONSTANT:
 *   return state.set('yourStateVariable', true);
 */
import { fromJS } from 'immutable';

import {
  LOAD_MOVIE,
  LOAD_MOVIE_SUCCESS,
  LOAD_MOVIE_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  movie: false
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_MOVIE:
      return state
        .set('loading', true)
        .set('error', false)
        .set('movie', false);
    case LOAD_MOVIE_SUCCESS:
      return state
        .set('loading', false)
        .set('movie', action.movie);
    case LOAD_MOVIE_ERROR:
      return state
        .set('loading', false)
        .set('error', action.error);
    default:
      return state;
  }
}

export default homeReducer;
