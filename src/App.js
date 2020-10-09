import React, { useContext, useRef, useCallback } from "react";
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./components/Home";
import Downloads from "./components/Downloads";
import Specialist from "./components/Specialist";
import OwnerTable from "./components/Specialist/OwnerTable";
import News from "./components/News";
import Gallery from "./components/Gallery";
import Asks from "./components/Asks";

import Login from "./components/Login";
import Notfound from "./components/Notfound";

import { firebaseAuthContext } from "./providers/AuthProvider";
import { GalleryUpload } from "./components/Gallery/GalleryUpload";

function App() {
  const { isLoggedIn, initial } = useContext(firebaseAuthContext);
  const lastPage = useRef("/");

  const handlePageClick = useCallback((path) => {
    lastPage.current = path;
    // console.log("Set last page:", path);
  }, []);

  const getLastPage = useCallback(() => {
    return lastPage.current;
  }, []);

  if (initial) {
    // console.log("Initialization");
    return <>Initialization...</>;
  }

  return (
    <div className="App">
      <Navbar isLoggedIn={isLoggedIn} />
      <main>
        <Switch>
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            setLastPage={handlePageClick}
            exact
            path="/"
            component={Home}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            setLastPage={handlePageClick}
            exact
            path="/downloads"
            component={Downloads}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            setLastPage={handlePageClick}
            exact
            path="/specialist"
            component={Specialist}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            setLastPage={handlePageClick}
            exact
            path="/specialist/owner"
            component={OwnerTable}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            setLastPage={handlePageClick}
            exact
            path="/gallery"
            component={Gallery}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            setLastPage={handlePageClick}
            exact
            path="/gallery/upload"
            component={GalleryUpload}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            setLastPage={handlePageClick}
            exact
            path="/news"
            component={News}
          />
          <PrivateRoute
            isLoggedIn={isLoggedIn}
            setLastPage={handlePageClick}
            exact
            path="/asks"
            component={Asks}
          />

          <RedirectComponent
            isLoggedIn={isLoggedIn}
            getLastPage={getLastPage}
            exact
            path="/login"
            component={Login}
          />
          {/* <Route
            exact
            path="/login"
            component={isLoggedIn ? RedirectComponent : Login}
          /> */}

          <Route component={Notfound} />
        </Switch>
      </main>
    </div>
  );
}

const RedirectComponent = ({ isLoggedIn, getLastPage, ...props }) => {
  if (isLoggedIn) {
    // console.log("Already logged in, Redirect to last page.");
    const lastPage = getLastPage();
    return <Redirect to={lastPage} />;
  }
  return <Route {...props} />;
};

const PrivateRoute = ({ isLoggedIn, setLastPage, ...props }) => {
  if (isLoggedIn) {
    setLastPage(props.path);
    return <Route {...props} />;
  }
  return <Redirect to="/login" />;
};

export default App;
