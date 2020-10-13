import { handleResponse, handleFetchError } from "../../helpers";
import { apiUrl } from "../../config";

export const getNewsById = (id) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json"
    }
  };

  return fetch(`${apiUrl}/news/one.php?id=${id}`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const update = (idToken, news) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ ...news })
  };

  return fetch(`${apiUrl}/news/manage/updateContent.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};
