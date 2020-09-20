import { handleResponse, handleFetchError }
 from "../../helpers"
const apiUrl = "http://clinictech.local";

export const getDownloads = () => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
    }
  };

  return fetch(`${apiUrl}/downloads/all.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
}

export const createDownload = (title) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ title }),
  };


  return fetch(`${apiUrl}/downloads/manage/create.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
}

export const createFiles = (files) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ files }),
  };

  return fetch(`${apiUrl}/downloads/manage/createFiles.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const deleteFile = (id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
  };

  return fetch(`${apiUrl}/downloads/manage/deleteFile.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
}

export const deleteDownload = (id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
  };

  return fetch(`${apiUrl}/downloads/manage/deleteDownload.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};