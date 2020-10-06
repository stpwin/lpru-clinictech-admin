import React, { useState, useEffect } from "react";
import { authMethods, auth } from "../firebaseAuthMethods";

export const firebaseAuthContext = React.createContext();

const AuthProvider = (props) => {
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initial, setinitial] = useState(true);

  useEffect(() => {
    if (error) {
      console.log({ error });
    }
  }, [error]);

  useEffect(() => {
    auth.onAuthStateChanged((userAuth) => {
      setinitial(false);
      // console.log("onAuthStateChanged", userAuth);
      const token = userAuth && Object.entries(userAuth)[5][1].b;
      setToken(token && token.g);
      if (userAuth) {
        // console.log({ idtoken: token.g });
        // userAuth.getIdToken().then((res) => {
        //   console.log(res);
        // });
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);

  const Signin = async (email, password) => {
    // console.log("handleSigninProvider");
    setLoading(true);
    setError("");
    await authMethods.signin(email, password, setError, setToken);
    setLoading(false);
  };

  const Signout = () => {
    setError("");
    authMethods.signout(setError, setToken);
  };

  return (
    <firebaseAuthContext.Provider
      value={{
        Signin,
        token,
        isLoggedIn,
        error,
        loading,
        initial,
        Signout
      }}
    >
      {props.children}
    </firebaseAuthContext.Provider>
  );
};

export default AuthProvider;
