import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";

import Home from "./components/Home";
import Downloads from "./components/Downloads";
import Specialist from "./components/Specialist";
import OwnerTable from "./components/Specialist/OwnerTable";
import News from "./components/News";
import Gallery from "./components/Gallery";

import Notfound from "./components/Notfound";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/downloads" component={Downloads} />
          <Route exact path="/specialist" component={Specialist} />
          <Route exact path="/specialist/owner" component={OwnerTable} />
          <Route exact path="/gallery" component={Gallery} />
          <Route exact path="/news" component={News} />
          <Route component={Notfound} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
