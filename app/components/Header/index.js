import React from 'react';
import { FormattedMessage } from 'react-intl';
import { SearchBox } from 'react-instantsearch/dom';
import {
  AppBar,
  Button,
  ButtonBase,
  Toolbar,
  Typography
} from 'material-ui';
import { withStyles } from 'material-ui/styles';
import 'react-instantsearch-theme-algolia/style.css';
import HeaderLink from './HeaderLink';
import './styles.css';

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
          <HeaderLink to="/library">
            <ButtonBase color="contrast" disableRipple>
              <Typography type="title" color="inherit" className={classes.title}>
                Bonflik
              </Typography>
            </ButtonBase>
          </HeaderLink>
          <div className={classes.search}>
            <SearchBox translations={{ placeholder: 'Search your movie collection' }} />
          </div>
          <HeaderLink to="/new">
            <Button color="contrast">Add Movie</Button>
          </HeaderLink>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
