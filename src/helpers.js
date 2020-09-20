export const handleResponse = (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") === -1) {
    console.warn("Response is not JSON format!");
    return null;
  } 

  return response.text().then((text) => {
    let error;
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
        error = data.error;
      } catch {
        console.warn("Parse JSON fail!");
        data = null;
        error = '{"error":"Parse JSON fail!"}';
      }
    }
    if (!response.ok) {
      // console.log(error)
      return Promise.reject(
        error
          ? `${response.statusText} ${JSON.stringify(error, null, 4)}`
          : ` ${response.statusText}`
      );
    }
    return data;
  });
};

export const handleNotfound = (e) => {
  if (e instanceof TypeError) {
    return Promise.reject(e)
  }
  console.log("Fetch not found:", e);
  // throw e;
  return null
};

export const handleFetchError = (e) => {
  if (e instanceof TypeError) {
    return Promise.reject("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
  }
  console.error("Fetch fail:", e);
  throw e;
};
