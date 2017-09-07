/**
 * Gets the repositories of the user from Github
 */

import qs from 'qs';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { SEARCH_MOVIES } from 'containers/App/constants';
import { moviesLoaded, movieLoadingError } from 'containers/App/actions';

import request from 'utils/request';
import { makeSelectQuery } from 'containers/Library/selectors';

/**
 * Github repos request/response handler
 */
export function* searchMovies() {
  // Select username from store
  const q = yield select(makeSelectQuery());
  const querystring = qs.stringify({ q });
  const requestURL = `/api/search?${querystring}`;

  try {
    // Call our request helper (see 'utils/request')
    const movies = yield call(request, requestURL);
    yield put(moviesLoaded(movies, q));
  } catch (err) {
    yield put(movieLoadingError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* () {
  // Watches for SEARCH_MOVIES actions and calls searchMovies when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(SEARCH_MOVIES, searchMovies);
}
