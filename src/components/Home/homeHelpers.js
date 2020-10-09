import { database } from "../../firebaseApp";
import { databasePath } from "../../config";

export const createWebContact = () => {
  const webContactDB = database.ref(`${databasePath}web-contact`);
  return webContactDB.set({
    email: "",
    facebook: "",
    facebookName: "",
    fax: "",
    footerText: "",
    place: "",
    placeName: "",
    tel: ""
  });
};

export const getWebContact = () => {
  const webContactDB = database.ref(`${databasePath}web-contact`);
  return webContactDB.once("value").then((snapshot) => {
    const values = snapshot.val();
    //   console.log(values);
    return values;
  });
};

export const saveWebContact = ({
  email,
  facebook,
  facebookName,
  fax,
  footerText,
  place,
  placeName,
  tel
}) => {
  const webContactDB = database.ref(`${databasePath}web-contact`);
  return webContactDB.update({
    email,
    facebook,
    facebookName,
    fax,
    footerText,
    place,
    placeName,
    tel
  });
};
