import { auth } from "./firebaseApp";
const authMethods = {
  signin: async (email, password, setError) => {
    await auth
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {})
      .catch((err) => {
        setError(err.message);
      });
  },
  signout: (setError) => {
    auth
      .signOut()
      .then((res) => {})
      .catch((err) => {
        setError(err.message);
        console.error(err.message);
      });
  }
};

export { authMethods, auth };
