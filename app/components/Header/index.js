import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { SearchBox } from 'react-instantsearch/dom';
import {
  AppBar,
  Button,
  Toolbar,
  Typography
} from 'material-ui';
import { withStyles } from 'material-ui/styles';
import 'react-instantsearch-theme-algolia/style.css';
import './styles.css';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import messages from './messages';

const styles = {
  search: {
    flex: 1,
    textAlign: 'center',
  },
  title: {
    marginRight: 30
  }
};

class Header extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { classes } = this.props;

    return (
      <AppBar>
        <Toolbar>
          <Typography type="title" color="inherit" className={classes.title}>
            Bonflik
          </Typography>
          <div className={classes.search}>
            <SearchBox translations={{ placeholder: 'Search your movie collection' }} />
          </div>
          <Link to="/new">
            <Button color="contrast">Add Movie</Button>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
