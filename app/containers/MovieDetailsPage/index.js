/*
 * MovieDetailPage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import LoadingIndicator from 'components/LoadingIndicator';
import {
  AppBar,
  Avatar,
  Button,
  Chip,
  Dialog,
  IconButton,
  Snackbar,
  Toolbar,
  Typography
} from 'material-ui';
import Collapse from 'material-ui/transitions/Collapse';
import Slide from 'material-ui/transitions/Slide';
import Card, { CardHeader, CardContent, CardMedia, CardActions } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import CloseIcon from 'material-ui-icons/Close';
import styled from 'styled-components';
import classes from 'classes';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import H2 from 'components/H2';
import { imageUrl } from 'components/MoviePoster';
import CenteredSection from './CenteredSection';
import Section from './Section';
import messages from './messages';
import { loadMovie } from './actions';
import { makeSelectMovie, makeSelectMovieLoading, makeSelectMovieLoadError } from './selectors';
import reducer from './reducer';
import saga from './saga';

const styles = theme => ({
  card: {
    maxWidth: 500,
    margin: 'auto'
  },
  media: {
    height: 350,
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    // backgroundColor: red[500],
  },
  row: {
    display: 'flex',
    alignItems: 'center'
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  chip: {
    marginRight: theme.spacing.unit
  }
});

const Wrapper = styled.div`
  width: 100%;
`;

export class MovieDetailPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  state = {
    expanded: false,
    open: true
  };

  componentWillMount() {
    const { params: { id } } = this.props.match;
    this.props.loadMoviePage(id);
  }

  // render() {

  //   return (
  //     <article>
  //       <div>
  //         <Section>
  //           <H2>
  //             {movie.title}
  //           </H2>
  //         </Section>
  //       </div>
  //     </article>
  //   );
  // }
  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  handleRequestClose = () => {
    this.props.history.goBack();
  };

  render() {
    const { loading, error, movie, classes = {} } = this.props;

    

    if (error) {
      return (
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'middle',
          }}
          open={true}
          autoHideDuration={6e3}
          onRequestClose={this.handleRequestClose}
          message={<span id="message-id">An error occurred</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleRequestClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      );
    }

    const InnerContent = () => {
      if (loading || !movie) {
        return <LoadingIndicator />;
      }

      return (
        <Wrapper>
          <Helmet>
            <title>{movie.title}</title>
          </Helmet>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe" className={classes.avatar}>
                  R
                </Avatar>
              }
              title={movie.title}
              subheader={movie.release_year}
            />
            <CardMedia
              className={classes.media}
              image={imageUrl(movie.poster_path, 780)}
              title={movie.title}
            />
            <CardContent>
              <Typography paragraph>
                {movie.overview}
              </Typography>
            </CardContent>
            <CardContent>
              <Typography type="body2">
                Genres
              </Typography>
              <div className={classes.row}>
                {movie.genres.map((genre) => (
                  <Chip label={genre} className={classes.chip} />
                ))}
              </div>
            </CardContent>
            <CardActions disableActionSpacing>
              <div className={classes.flexGrow} />
              <IconButton
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="Show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </CardActions>
            <Collapse in={this.state.expanded} transitionDuration="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph type="body2">
                  {movie.tagline}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </Wrapper>
      );
    };

    return (
      <Dialog
        open={this.state.open}
        onRequestClose={this.handleRequestClose}
        transition={<Slide direction="up" />}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton color="contrast" onClick={this.handleRequestClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flexGrow}>
              Movie Details
            </Typography>
            <Button color="contrast" onClick={this.handleRequestClose}>
              Back
            </Button>
          </Toolbar>
        </AppBar>
        <InnerContent />
      </Dialog>
    );
  }
}

MovieDetailPage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  movie: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
  ]),
  match: PropTypes.object,
  loadMoviePage: PropTypes.func
};

export function mapDispatchToProps(dispatch) {
  return {
    loadMoviePage: (id) => dispatch(loadMovie(id)),
  };
}

const mapStateToProps = createStructuredSelector({
  movie: makeSelectMovie(),
  loading: makeSelectMovieLoading(),
  error: makeSelectMovieLoadError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'movie', reducer });
const withSaga = injectSaga({ key: 'movie', saga });

const StyledMovieDetailPage = withStyles(styles)(MovieDetailPage);

export default withRouter(compose(
  withReducer,
  withSaga,
  withConnect,
)(StyledMovieDetailPage));
