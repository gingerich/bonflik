/**
 * MovieListItem
 *
 * Lists the name and the issue count of a repository
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import H3 from 'components/H3';
import ListItem from 'components/ListItem';
import MovieLink from './MovieLink';
import MoviePoster from './MoviePoster';
import Wrapper from './Wrapper';

export class MovieListItem extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const item = this.props.item;
    const url = `/library/${item.id}`;

    // Put together the content of the repository
    const content = (
      <Wrapper>
        <MovieLink href={url}>
          <MoviePoster src={item.image} />
          <H3>{item.name || item.title}</H3>
        </MovieLink>
      </Wrapper>
    );

    // Render the content into a list item
    return (
      <ListItem key={`repo-list-item-${item.full_name}`} item={content} />
    );
  }
}

MovieListItem.propTypes = {
  item: PropTypes.object
};

export default connect(createStructuredSelector({
}))(MovieListItem);
