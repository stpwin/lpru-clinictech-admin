import { storage } from "./firebaseApp";
import uuid from "uuid/dist/v4";

export const uploadImage = (fileBlob, path) => {
  return new Promise((resolve, reject) => {
    const newName = `${uuid()}`; //.${fileObj.name.split('.').pop()}`
    const storageRef = storage.ref(`${path}/${newName}`);
    const task = storageRef.put(fileBlob);

    task.on(
      "state_changed",
      function (snapshot) {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Uploading ${newName}: ${progress.toFixed(2)}% done`);
      },
      function (err) {
        console.log("Upload fail!");
        reject(err.code);
      },
      function () {
        // Upload completed successfully, now we can get the download URL
        task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          // resolve(downloadURL);
          resolve(newName);
        });
      }
    );
  });
};

export default uploadImage;
