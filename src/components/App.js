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
      <BrowserRouter>
      <div>
        <Navigation/>
        <Switch>
          <Route path="/" component={Home} exact/>
          <Route path="/search-by-location" component={SearchByLocation}/>
          <Route path="/search-by-prefecture" component={SearchByPrefecture}/>
          <Route component={Error}/>
        </Switch>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
