import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";
import "firebase/functions";
import { firebaseConfig } from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage();
export const database = firebase.database();
export const auth = firebase.auth();
export const functions = firebase.functions();
export default firebase;
