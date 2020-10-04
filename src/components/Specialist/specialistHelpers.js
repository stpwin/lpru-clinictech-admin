import { handleResponse, handleFetchError } from "../../helpers";
import { apiUrl } from "../../config";

export const getSpecialist = () => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  };

  return fetch(`${apiUrl}/specialist/all.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const createSpecialist = (title, thumbnail) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ title, thumbnail }),
  };

  return fetch(`${apiUrl}/specialist/manage/create.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const changeTitle = (specialist_id, title) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ specialist_id, title }),
  };

  return fetch(`${apiUrl}/specialist/manage/changeTitle.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const changeImage = (specialist_id, thumbnail) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ specialist_id, thumbnail }),
  };

  return fetch(`${apiUrl}/specialist/manage/changeImage.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const removeSpecialist = (id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
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

export const addDescription = (specialist_id, description) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ specialist_id, description }),
  };

  return fetch(`${apiUrl}/specialist/manage/addDescription.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const removeDescription = (id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
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

export const getOwnersExcept = (except) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ except }),
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

export const getAllOwners = () => {
  const requestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    // body: JSON.stringify({ except }),
  };

  return fetch(`${apiUrl}/specialist/manage/getAllOwners.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const getOwnerByID = (id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
  };

  return fetch(`${apiUrl}/specialist/manage/getOwnerByID.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const addOwner = (specialist_id, owner_id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ specialist_id, owner_id }),
  };

  return fetch(`${apiUrl}/specialist/manage/addOwner.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const createOwner = (owner) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ owner }),
  };

  return fetch(`${apiUrl}/specialist/manage/createOwner.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const updateOwner = (owner) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ owner }),
  };

  return fetch(`${apiUrl}/specialist/manage/updateOwner.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const updateOwnerImage = (owner_id, image) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ owner_id, image }),
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

export const removeOwner = (id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
  };

  return fetch(`${apiUrl}/specialist/manage/removeOwner.php`, requestOptions)
    .then(handleResponse)
    .then((res) => {
      return res;
    })
    .catch(handleFetchError);
};

export const removeOwnerSpecialist = (id) => {
  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: JSON.stringify({ id }),
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
