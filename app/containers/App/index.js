/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route, withRouter } from 'react-router-dom';
import { InstantSearch } from 'react-instantsearch/dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import qs from 'qs';

import AddNew from 'containers/AddNew/Loadable';
import Library from 'containers/Library/Loadable';
import MovieDetailsPage from 'containers/MovieDetailsPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';

const AppWrapper = styled.div`
  max-width: calc(1024px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

const InnerApp = styled.div`
  margin-top: 64px;
`;

const theme = createMuiTheme();

const createSearchURL = (state) => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
  searchState ? `/library${createSearchURL(searchState)}` : '';

const Search = withRouter(class extends React.PureComponent {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }),
    location: PropTypes.object.isRequired,
    // children: PropTypes.array(PropTypes.node)
  }

  constructor(props) {
    super(props);
    this.state = {
      searchState: qs.parse(props.location.search.slice(1))
    };
  }

  onSearchStateChange = (searchState) => {
    clearTimeout(this.debouncedSetState);
    // this.debouncedSetState = setTimeout(() => {
    //   this.props.history.push(
    //     searchStateToUrl(this.props, searchState),
    //     searchState
    //   );
    // }, 700);
    this.setState({ searchState });
  };

  render() {
    return (
      <InstantSearch
        appId="49V7NSWBS3"
        apiKey="5a70ccfbf28b0c0ab1cd61053b8599ea"
        indexName="movies"
        searchState={this.state.searchState}
        onSearchStateChange={this.onSearchStateChange}
        createURL={createSearchURL}
      >
        {this.props.children}
      </InstantSearch>
    );
  }
});

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Search>
        <AppWrapper>
          <Helmet
            titleTemplate="%s - Bonflik"
            defaultTitle="Bonflik"
          >
            <meta name="description" content="Manage your movies" />
          </Helmet>
          <Header />
          <InnerApp>
              <Route path="/library/:id" component={MovieDetailsPage} />
            <Switch>
              <Route exact path="/" component={Library} />
              <Route path="/new" component={AddNew} />
              <Route path="/library" component={Library} />
              <Route path="" component={NotFoundPage} />
            </Switch>
          </InnerApp>
          <Footer />
        </AppWrapper>
      </Search>
    </MuiThemeProvider>
  );
}
