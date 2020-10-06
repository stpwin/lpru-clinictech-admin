import { handleResponse, handleFetchError } from "../../helpers";
import { apiUrl } from "../../config";

export const getDownloads = (idToken) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "X-Token": idToken
    }
  };

  return fetch(`${apiUrl}/downloads/manage/all.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const createDownload = (idToken, title) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ title })
  };

  return fetch(`${apiUrl}/downloads/manage/create.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const createFiles = (idToken, files) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ files })
  };

  return fetch(`${apiUrl}/downloads/manage/createFiles.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const deleteFile = (idToken, id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id })
  };

  return fetch(`${apiUrl}/downloads/manage/deleteFile.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const deleteDownload = (idToken, id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id })
  };

  return fetch(`${apiUrl}/downloads/manage/deleteDownload.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};
