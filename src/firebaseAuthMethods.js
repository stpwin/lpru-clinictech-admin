import { auth } from "./firebaseApp";
const authMethods = {
  signin: async (email, password, setError, setToken) => {
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        // const token = await Object.entries(res.user)[5][1].b;
        // console.log({ token });
        // await localStorage.setItem("token", JSON.stringify(token));
        // setToken(token);
      })
      .catch((err) => {
        setError(err.message);
        // console.warn(err.message);
      });
  },
  signout: (setError, setToken) => {
    auth
      .signOut()
      .then((res) => {
        localStorage.removeItem("token");
        setToken(null);
      })
      .catch((err) => {
        setError(err.message);
        localStorage.removeItem("token");
        setToken(null);
        console.error(err.message);
      });
  }
};

export { authMethods, auth };
