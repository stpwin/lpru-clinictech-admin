import { handleResponse, handleFetchError } from "../../helpers";
import { apiUrl } from "../../config";

export const getSpecialist = (idToken) => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "X-Token": idToken
    }
  };

  return fetch(`${apiUrl}/specialist/manage/all.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const createSpecialist = (idToken, title, thumbnail) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ title, thumbnail })
  };

  return fetch(`${apiUrl}/specialist/manage/create.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const changeTitle = (idToken, specialist_id, title) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ specialist_id, title })
  };

  return fetch(`${apiUrl}/specialist/manage/changeTitle.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const changeImage = (idToken, specialist_id, thumbnail) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ specialist_id, thumbnail })
  };

  return fetch(`${apiUrl}/specialist/manage/changeImage.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const removeSpecialist = (idToken, id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id })
  };

  return fetch(
    `${apiUrl}/specialist/manage/removeSpecialist.php`,
    requestOptions
  )
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const addDescription = (idToken, specialist_id, description) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ specialist_id, description })
  };

  return fetch(`${apiUrl}/specialist/manage/addDescription.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const removeDescription = (idToken, id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id })
  };

  return fetch(
    `${apiUrl}/specialist/manage/removeDescription.php`,
    requestOptions
  )
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const getOwnersExcept = (idToken, except) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ except })
  };

  return fetch(
    `${apiUrl}/specialist/manage/getOwnersExcept.php`,
    requestOptions
  )
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const getAllOwners = (idToken) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "X-Token": idToken
    }
    // body: JSON.stringify({ except }),
  };

  return fetch(`${apiUrl}/specialist/manage/getAllOwners.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const getOwnerByID = (idToken, id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id })
  };

  return fetch(`${apiUrl}/specialist/manage/getOwnerByID.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const addOwner = (idToken, specialist_id, owner_id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ specialist_id, owner_id })
  };

  return fetch(`${apiUrl}/specialist/manage/addOwner.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const createOwner = (idToken, owner) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ owner })
  };

  return fetch(`${apiUrl}/specialist/manage/createOwner.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const updateOwner = (idToken, owner) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ owner })
  };

  return fetch(`${apiUrl}/specialist/manage/updateOwner.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const updateOwnerImage = (idToken, owner_id, image) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ owner_id, image })
  };

  return fetch(
    `${apiUrl}/specialist/manage/updateOwnerImage.php`,
    requestOptions
  )
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const removeOwner = (idToken, id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id })
  };

  return fetch(`${apiUrl}/specialist/manage/removeOwner.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const removeOwnerSpecialist = (idToken, id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "X-Token": idToken
    },
    body: JSON.stringify({ id })
  };

  return fetch(
    `${apiUrl}/specialist/manage/removeOwnerSpecialist.php`,
    requestOptions
  )
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};
