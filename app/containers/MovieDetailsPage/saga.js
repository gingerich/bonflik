/**
 * Gets the repositories of the user from Github
 */

import { call, put, takeEvery } from 'redux-saga/effects';

import request from 'utils/request';
import { movieLoaded, movieLoadingError } from './actions';
import { LOAD_MOVIE } from './constants';

/**
 * Github movie request/response handler
 */
export function* getMovie({ id }) {
  const requestURL = `/api/library/${id}`;

  try {
    // Call our request helper (see 'utils/request')
    const movie = yield call(request, requestURL);
    yield put(movieLoaded(movie, id));
  } catch (err) {
    yield put(movieLoadingError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* getMovieDetails() {
  yield takeEvery(LOAD_MOVIE, getMovie);
}
