import React, { useState, useEffect } from "react";
import { authMethods, auth } from "../firebaseAuthMethods";

export const firebaseAuthContext = React.createContext();

const AuthProvider = (props) => {
  const [error, setError] = useState("");
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
      if (userAuth) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setinitial(false);
    });
  }, []);

  const getToken = async () => {
    return await auth.currentUser.getIdToken();
  };

  const Signin = async (email, password) => {
    setLoading(true);
    setError("");
    await authMethods.signin(email, password, setError);
    setLoading(false);
  };

  const Signout = () => {
    setError("");
    authMethods.signout(setError);
  };

  return (
    <firebaseAuthContext.Provider
      value={{
        Signin,
        getToken,
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
