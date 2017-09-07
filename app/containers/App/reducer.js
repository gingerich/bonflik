/*
 * AppReducer
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
  SEARCH_MOVIES_SUCCESS,
  SEARCH_MOVIES,
  SEARCH_MOVIES_ERROR,
} from './constants';

// The initial state of the App
const initialState = fromJS({
  loading: false,
  error: false,
  currentUser: false,
  searchData: {
    movies: false,
  },
});

function appReducer(state = initialState, action) {
  switch (action.type) {
    case SEARCH_MOVIES:
      return state
        .set('loading', true)
        .set('error', false)
        .setIn(['searchData', 'movies'], false);
    case SEARCH_MOVIES_SUCCESS:
      return state
        .setIn(['searchData', 'movies'], action.movies)
        .set('loading', false);
    case SEARCH_MOVIES_ERROR:
      return state
        .set('error', action.error)
        .set('loading', false);
    default:
      return state;
  }
}

export default appReducer;
