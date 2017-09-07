/*
 * LibraryPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import {
  InstantSearch,
  SearchBox,
  Hits,
  Highlight,
  Stats,
  SortBy,
  Pagination,
  RefinementList,
  PoweredBy
} from 'react-instantsearch/dom';
import { connectHits } from 'react-instantsearch/connectors';
import styled from 'styled-components';
import { withStyles } from 'material-ui/styles';
import {
  Button,
  Chip,
  Grid,
  Typography
} from 'material-ui';
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card';

import { imageUrl } from 'components/MoviePoster';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import { makeSelectMovies, makeSelectLoading, makeSelectError } from 'containers/App/selectors';
import A from 'components/A';
import H2 from 'components/H2';
import MoviesList from 'components/MoviesList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { searchMovies } from '../App/actions';
import { changeQuery } from './actions';
import { makeSelectQuery } from './selectors';
import reducer from './reducer';
import saga from './saga';

const styles = theme => ({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    verticalAlign: 'center'
  },
  grid: {
    marginTop: 10
  },
  flexGrow: {
    flexGrow: 1 
  },
  flexRight: {
    flex: 1,
    textAlign: 'right'
  },
  card: {
    width: 226,
  },
  media: {
    height: 300
  },
  chip: {
    height: 25,
    marginRight: theme.spacing.unit
  },
  title: {
    height: 40
  }
});

const SideBar = () => {
  return (
    <div>

    </div>
  );
};

const Hit = withStyles(styles)(({ hit, classes }) => {
  return (
    <Grid item>
      <Card className={classes.card}>
        <Link to={`/library/${hit.objectID}`}>
          <CardMedia
            className={classes.media}
            image={imageUrl(hit.poster_path)}
            title={hit.title}
          />
        </Link>
        <CardContent>
          <Typography type="title" align="left" className={classes.title} gutterBottom>
            {hit.title}
          </Typography>
          <Typography paragraph align="left">
            {hit.overview ? hit.overview.slice(0, 64) : null}...
          </Typography>
          <div className={classes.row}>
            <div>
              {hit.genres.slice(0, 1).map((genre) => <Chip label={genre} className={classes.chip} />)}
            </div>
            <div className={classes.flexGrow}></div>
            <Typography>
              {hit.release_year}
            </Typography>
          </div>
        </CardContent>
        <CardActions>
          <div className={classes.flexGrow}></div>
          <Link to={`/library/${hit.objectID}`}>
            <Button dense color="primary">See Details</Button>
          </Link>
        </CardActions>
      </Card>
    </Grid>
  );
});

const SearchResultsHeader = withStyles(styles)(({ classes }) => {
  return (
    <div className={classes.row}>
      <Stats />
      <div className={classes.flexRight}>
        <SortBy
          defaultRefinement="movies"
          items={[
            { value: 'movies', label: 'Most Relevant' },
            { value: 'movies_popularity_desc', label: 'Most Popular' },
            { value: 'movies_release_year_desc', label: 'Newest First' },
            { value: 'movies_release_year_asc', label: 'Oldest First' },
          ]}
        />
      </div>
    </div>
  );
});

const CustomHits = connectHits(({ hits, ...props }) => {
  const hitList = hits.map(hit => <Hit hit={hit} />);
  return (
    <Grid container spacing={16} {...props} >
      {hitList}
    </Grid>
  );
});

const Content = withStyles(styles)(({ classes }) => {
  return (
    <div>
      <SearchResultsHeader />
      <CustomHits className={classes.grid} />
      <div>
        <Pagination showLast />
      </div>
    </div>
  );
});

const Wrapper = styled.div`
  padding: 25px;
`;

export class LibraryPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state query is not null, submit the form to load movies
   */
  componentDidMount() {
    if (this.props.query && this.props.query.trim().length > 0) {
      this.props.onSubmitForm();
    }
  }

  render() {
    const { loading, error, movies } = this.props;
    const moviesListProps = {
      loading,
      error,
      movies,
    };

    return (
      <Wrapper>
        <CenteredSection>
          <Content />
          <PoweredBy />
        </CenteredSection>
      </Wrapper>
    );
  }
}

LibraryPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  movies: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
  ]),
  onSubmitForm: PropTypes.func,
  query: PropTypes.string,
  onChangeQuery: PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    onChangeQuery: (evt) => dispatch(changeQuery(evt.target.value)),
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) evt.preventDefault();
      dispatch(searchMovies());
    },
  };
}

const mapStateToProps = createStructuredSelector({
  movies: makeSelectMovies(),
  query: makeSelectQuery(),
  loading: makeSelectLoading(),
  error: makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'library', reducer });
const withSaga = injectSaga({ key: 'library', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(LibraryPage);
