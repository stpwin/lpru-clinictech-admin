import { storage } from "./firebaseApp";
import uuid from "uuid/dist/v4";
import { storagePath } from "./config";

export const uploadAsPromise = (
  fileObj,
  callback,
  index,
  downloadsID = "",
  downloadsTitle = "",
  path = "public_files/"
) => {
  return new Promise((resolve, reject) => {
    const metadata = {
      customMetadata: {
        downloadsID,
        downloadsTitle
      }
    };
    const newName = fileObj.name;
    const storageRef = storage.ref(`${storagePath}${path}${newName}`);
    let task;
    if (downloadsID || downloadsTitle) {
      task = storageRef.put(fileObj, metadata);
    } else {
      task = storageRef.put(fileObj);
    }

    return task.on(
      "state_changed",
      function (snapshot) {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Uploading ${newName}: ${progress.toFixed(2)}% done`);
        // switch (snapshot.state) {
        //   case "paused":
        //     // console.log("Upload is paused");
        //     break;
        //   case "running":
        //     // console.log("Upload is running");
        //     break;
        // }
      },
      function (err) {
        console.log("Upload fail!");
        reject("Upload fail!");
        // switch (err.code) {
        //   case "storage/unauthorized":
        //     // User doesn't have permission to access the object
        //     break;

        //   case "storage/canceled":
        //     // User canceled the upload
        //     break;

        //   case "storage/unknown":
        //     // Unknown error occurred, inspect error.serverResponse
        //     break;
        // }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        task.snapshot.ref.getDownloadURL().then((downloadURL) => {
          callback(index, downloadURL);
          // console.log("File available at", downloadURL);
          return resolve(true);
        });
      }
    );
  });
};

export const uploadImage = (fileBlob, path) => {
  return new Promise((resolve, reject) => {
    const newName = `${uuid()}`; //.${fileObj.name.split('.').pop()}`
    const storageRef = storage.ref(`${storagePath}${path}/${newName}`);
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
