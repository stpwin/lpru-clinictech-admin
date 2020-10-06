import { database } from "../../firebaseApp";

export const getWebContact = () => {
  const webContactDB = database.ref("web-contact");
  return webContactDB
    .once("value")
    .then((snapshot) => {
      const values = snapshot.val();
      //   console.log(values);
      return values;
    })
    .catch((err) => {
      console.warn(err);
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
  const webContactDB = database.ref("web-contact");
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
