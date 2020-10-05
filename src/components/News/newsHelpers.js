import { handleResponse, handleFetchError } from "../../helpers";
import { apiUrl } from "../../config";

export const getNews = () => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  return fetch(`${apiUrl}/news/manage/all.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const create = (news) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ ...news }),
  };

  return fetch(`${apiUrl}/news/manage/create.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const setPublic = (id, _public) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id, _public: _public ? 1 : 0 }),
  };

  return fetch(`${apiUrl}/news/manage/setPublic.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const updateInfo = (id, title, subtitle) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id, title, subtitle }),
  };

  return fetch(`${apiUrl}/news/manage/update.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const updateImage = (id, image) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id, image }),
  };

  return fetch(`${apiUrl}/news/manage/updateImage.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const remove = (id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
  };

  return fetch(`${apiUrl}/news/manage/delete.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};
