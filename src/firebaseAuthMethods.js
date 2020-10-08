import { auth } from "./firebaseApp";
const authMethods = {
  signin: async (email, password, setError) => {
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
  signout: (setError) => {
    auth
      .signOut()
      .then((res) => {
        // localStorage.removeItem("token");
      })
      .catch((err) => {
        setError(err.message);
        // localStorage.removeItem("token");
        console.error(err.message);
      });
  }
};

export { authMethods, auth };
