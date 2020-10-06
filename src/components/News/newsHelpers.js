import { handleResponse, handleFetchError } from "../../helpers";
import { apiUrl } from "../../config";

export const getNews = (idToken) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "X-Token": idToken
    }
  };

  return fetch(`${apiUrl}/news/manage/all.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const create = (idToken, news) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ ...news })
  };

  return fetch(`${apiUrl}/news/manage/create.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const setPublic = (idToken, id, _public) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id, _public: _public ? 1 : 0 })
  };

  return fetch(`${apiUrl}/news/manage/setPublic.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const updateInfo = (idToken, id, title, subtitle) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id, title, subtitle })
  };

  return fetch(`${apiUrl}/news/manage/update.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const updateImage = (idToken, id, image) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id, image })
  };

  return fetch(`${apiUrl}/news/manage/updateImage.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const remove = (idToken, id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id })
  };

  return fetch(`${apiUrl}/news/manage/delete.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};
