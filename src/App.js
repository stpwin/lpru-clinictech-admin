import React from 'react';
import './App.css';
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home"
import Downloads from './components/Downloads'
import Notfound from './components/Notfound';

function App() {
  return (
    <div className='App'>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/downloads' component={Downloads} />
        <Route component={Notfound} />
      </Switch>
    </div>
  );
}

export default App;
