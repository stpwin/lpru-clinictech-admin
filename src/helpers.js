export const handleResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") === -1) {
    console.warn("Response is not JSON format!", await response.text());
    return Promise.reject("ข้อมูลไม่ถูกต้อง");
  }

  return await response.text().then((text) => {
    let error;
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
        error = data.error;
      } catch {
        console.warn("Parse JSON fail!", text);
        data = null;
        error = "ข้อมูลไม่ถูกต้อง";
      }
    }
    if (!response.ok || error) {
      // console.log(error);
      return Promise.reject(error);
    }
    return data;
  });
};

export const handleNotfound = (e) => {
  if (e instanceof TypeError) {
    return Promise.reject(e);
  }
  console.log("Fetch not found:", e);
  // throw e;
  return null;
};

export const handleFetchError = (e) => {
  if (e instanceof TypeError) {
    Promise.reject("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
  }
  console.error("Fetch fail:", e);
  // Promise.reject(e);
  throw e;
};

export const getSpecialistImage = (image) => {
  return `https://firebasestorage.googleapis.com/v0/b/lpru-clinictech.appspot.com/o/specialist_images%2F${image}?alt=media`;
};
export const getOwnerImage = (image) => {
  return `https://firebasestorage.googleapis.com/v0/b/lpru-clinictech.appspot.com/o/owner_images%2F${image}?alt=media`;
};
export const getNewsImage = (image) => {
  return `https://firebasestorage.googleapis.com/v0/b/lpru-clinictech.appspot.com/o/news_images%2F${image}?alt=media`;
};
export const getGalleryImage = (image) => {
  return `https://firebasestorage.googleapis.com/v0/b/lpru-clinictech.appspot.com/o/gallery_images%2F${image}?alt=media`;
};
