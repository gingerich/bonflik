import React from 'react';
import PropTypes from 'prop-types';

const DEFAULT_WIDTH = 185;

export const imageUrl = (path, size = DEFAULT_WIDTH) => `http://image.tmdb.org/t/p/w${size}${path}`;

export default function MoviePoster({ path, size = DEFAULT_WIDTH, ...props }) {
  return <img width={size} src={imageUrl(path, size)} {...props} />;
}

MoviePoster.propTypes = {
  path: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ])
};
