/*
 * AddNew
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Redirect, withRouter } from 'react-router-dom';
import TagsInput from 'react-tagsinput';
import AutosizeInput from 'react-input-autosize';
import {
  Button,
  Chip,
  Paper,
  TextField,
  Typography
} from 'material-ui';
import { withStyles } from 'material-ui/styles';
import styled from 'styled-components';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import request from 'utils/request';
import H2 from 'components/H2';
import MoviePoster, { imageUrl } from 'components/MoviePoster';
import MovieLookup from 'containers/MovieLookup';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';
import { loadRepos } from '../App/actions';
import { changeUsername } from './actions';
import { makeSelectUsername } from './selectors';
import reducer from './reducer';
import saga from './saga';

const styles = theme => ({
  container: {
    // display: 'flex',
    flexWrap: 'wrap',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'left',
    flexWrap: 'wrap',
  },
  formControl: {
    marginTop: 35,
  },
  flex: {
    flex: 1,
  },
  textField: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    flex: 1
  },
  inner: {
    width: '70%',
    minWidth: 500,
    margin: 'auto'
  },
  button: {
    float: 'right',
    marginTop: 32,
    marginBottom: 32,
  },
  chip: {
    marginRight: theme.spacing.unit / 2,
    marginTop: 2,
    marginBottom: 2,
  },
  paper: {
    padding: theme.spacing.unit * 2
  }
});

const Wrapper = styled.div`
  width: 512px;
  min-width: 500px;
  margin: 25px auto
`;

const Backdrop = ({ path, size }) => {
  if (!path) return null;
  const url = imageUrl(path, size);
  const style = {
    width: '100%',
    height: 150,
    backgroundImage: `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  return <div style={style}></div>;
};

export class AddNew extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor (props) {
    super(props);
    this.state = {
      submitted: false,
      form: {
        cast: [],
        genres: []
      }
    };
  }

  onSuggestionSelected = (movieData, { suggestion }) => {
    this.setState({
      form: {
        ...movieData,
        cast: movieData.cast.slice(0, 5),
        genres: movieData.genres.map(g => g.name),
        release_year: new Date(movieData.release_date).getUTCFullYear()
      }
    });
  };

  setField = (field, value) => {
    this.setState({
      form: {
        ...this.state.form,
        [field]: value
      }
    });
  };

  changeHandler = (field) => (value) => {
    this.setField(field, value);
  };

  changeEventHandler = (field) => ({ target: { value } }) => {
    this.setField(field, value);
  }

  handleSubmit = (event) => {
    console.log('Submit', this.state.form);
    event.preventDefault();
    request('/api/library', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state.form)
    }).then(() => {
      this.setState({
        submitted: true
      });
    }, (err) => {
      console.error(err);
    });
  };

  render() {
    if (this.state.submitted) {
      return <Redirect to="/library" />;
    }

    const { classes } = this.props;
    const movieLookupProps = {
      inputProps: {
        placeholder: 'Enter a movie title',
        className: classes.textField
      },
      onSuggestionSelected: this.onSuggestionSelected,
      onChange: this.changeEventHandler('title')
    };

    const renderInput = (props) => {
      return <TextField {...props} className={classes.textField} />;
    };

    const renderTag = (props) => {
      const { tag, key, disabled, onRemove, getTagDisplayValue, ...other } = props;
      return (
        <Chip {...other}
          label={getTagDisplayValue(tag)}
          key={key}
          onRequestDelete={(e) => onRemove(key)}
          disabled={disabled}
          className={classes.chip}
        />
      );
    };

    const renderChipInput = (tagComponents, inputComponent) => (
      <div className={classes.row}>
        {tagComponents}
        {inputComponent}
      </div>
    );

    return (
      <article>
        <Helmet>
          <title>Add a Movie</title>
          <meta name="description" content="Add a movie from your home collection" />
        </Helmet>
        <Backdrop path={this.state.form.backdrop_path} size={780} />
        <Wrapper>
          <Section>
            <Typography type="headline" gutterBottom>
              {this.state.form.title || 'Add a Movie'}
            </Typography>
          </Section>
          <Form className={classes.container} onSubmit={this.handleSubmit}>
            <Paper className={classes.paper} elevation={4}>
              <MovieLookup {...movieLookupProps} />
              <TextField multiline
                id="overview"
                label="Overview"
                placeholder="Plot overview"
                value={this.state.form.overview}
                onChange={this.changeEventHandler('overview')}
                className={classes.textField}
              />
              <div className={classes.formControl}>
                <label>
                  <Typography type="caption" color="inherit" gutterBottom>Genre</Typography>
                </label>
                <TagsInput
                  value={this.state.form.genres}
                  onChange={this.changeHandler('genres')}
                  inputProps={{ placeholder: 'Add a genre', className: classes.flex }}
                  renderInput={TextField}
                  renderTag={renderTag}
                  renderLayout={renderChipInput}
                />
              </div>
              <div className={classes.formControl}>
                <label>
                  <Typography type="caption" color="inherit" gutterBottom>Cast Members</Typography>
                </label>
                <TagsInput
                  value={this.state.form.cast}
                  onChange={this.changeHandler('cast')}
                  inputProps={{ placeholder: 'Add a cast member', className: classes.flex }}
                  renderInput={TextField}
                  renderTag={renderTag}
                  renderLayout={renderChipInput}
                />
              </div>
              <TextField
                id="release_year"
                label="Year"
                type="number"
                className={classes.textField}
                placeholder="Year of release"
                value={this.state.form.release_year}
                onChange={this.changeEventHandler('release_year')}
              />
            </Paper>
            <Button
              raised
              type="submit"
              color="primary"
              className={classes.button}
            >
              Save
            </Button>
          </Form>
        </Wrapper>
      </article>
    );
  }
}

AddNew.propTypes = {
  history: PropTypes.object
};

// AddNew.propTypes = {
//   loading: PropTypes.bool,
//   error: PropTypes.oneOfType([
//     PropTypes.object,
//     PropTypes.bool,
//   ]),
//   repos: PropTypes.oneOfType([
//     PropTypes.array,
//     PropTypes.bool,
//   ]),
//   onSubmitForm: PropTypes.func,
//   username: PropTypes.string,
//   onChangeUsername: PropTypes.func,
// };

// export function mapDispatchToProps(dispatch) {
//   return {
//     onChangeUsername: (evt) => dispatch(changeUsername(evt.target.value)),
//     onSubmitForm: (evt) => {
//       if (evt !== undefined && evt.preventDefault) evt.preventDefault();
//       dispatch(loadRepos());
//     },
//   };
// }

// const mapStateToProps = createStructuredSelector({
//   // repos: makeSelectRepos(),
//   // username: makeSelectUsername(),
//   // loading: makeSelectLoading(),
//   // error: makeSelectError(),
// });

// const withConnect = connect(mapStateToProps, mapDispatchToProps);

// const withReducer = injectReducer({ key: 'home', reducer });
// const withSaga = injectSaga({ key: 'home', saga });

// export default compose(
//   withReducer,
//   withSaga,
//   withConnect,
// )(AddNew);

export default withStyles(styles)(AddNew);
