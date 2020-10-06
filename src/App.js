import React, { useContext } from "react";
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";

import Home from "./components/Home";
import Downloads from "./components/Downloads";
import Specialist from "./components/Specialist";
import OwnerTable from "./components/Specialist/OwnerTable";
import News from "./components/News";
import Gallery from "./components/Gallery";

import Login from "./components/Login";
import Notfound from "./components/Notfound";
import Navbar from "./components/Navbar";

import { firebaseAuthContext } from "./providers/AuthProvider";

function App() {
  const { isLoggedIn } = useContext(firebaseAuthContext);
  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} />
      <main>
        <Switch>
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            exact
            path="/"
            component={Home}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            exact
            path="/downloads"
            component={Downloads}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            exact
            path="/specialist"
            component={Specialist}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            exact
            path="/specialist/owner"
            component={OwnerTable}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            exact
            path="/gallery"
            component={Gallery}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            exact
            path="/news"
            component={News}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            exact
            path="/asks"
            component={Notfound}
          />

          <Route
            exact
            path="/login"
            component={isLoggedIn ? RedirectComponent : Login}
          />

          <Route component={Notfound} />
        </Switch>
      </main>
    </div>
  );
}

const RedirectComponent = () => <Redirect to="/" />;

const PrivateRoute = ({ isLoggedIn, ...props }) =>
  isLoggedIn ? <Route {...props} /> : <Redirect to="/login" />;

export default App;
