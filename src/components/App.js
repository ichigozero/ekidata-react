import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import '../css/App.css';

import Home from './Home';
import Navigation from './Navigation';
import Error from './Error'
import SearchByLocation from './SearchByLocation';
import SearchByPrefecture from './SearchByPrefecture';

class App extends Component {
  render() {
    return (
      <main role="main" className="container">
        <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Navigation/>
        <div className="mt-4 ml-4 mr-4 mb-5">
          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/search-by-location" component={SearchByLocation}/>
            <Route path="/search-by-prefecture" component={SearchByPrefecture}/>
            <Route component={Error}/>
          </Switch>
        </div>
        </BrowserRouter>
      </main>
    );
  }
}

export default App;
