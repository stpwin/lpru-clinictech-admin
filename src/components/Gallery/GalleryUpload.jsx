import React, { useState, createRef, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { PreviewImage } from "./PreviewImage";
import Resizer from "react-image-file-resizer";
import { uploadAsPromise } from "../../fileUpload";
import UploadingPlaceholder from "./Uploading-200.png";
import { storage } from "../../firebaseApp";
import { storagePath } from "../../config";
import { getGalleryImage } from "../../storageHelpers";

export const GalleryUpload = () => {
  const location = useLocation();
  const history = useHistory();
  const storageRef = storage.ref(`${storagePath}gallery`);

  const [identify, setIdentify] = useState({ id: null, title: "" });
  const [images, setImages] = useState([{}]);
  const [wait, setWait] = useState(false);
  const [m, setM] = useState(0);

  const hiddenFileInput = createRef();

  useEffect(() => {
    // console.log(location.state);
    const _identify = location?.state?.identify;
    if (!_identify) {
      history.push("/gallery");
      return;
    }
    setIdentify(_identify);

    // console.log(`${storagePath}gallery/${_identify.id}`);

    storageRef
      .child(`${_identify.id}`)
      .listAll()
      .then((res) => {
        const _images = res.items.map((item) => {
          return {
            url: "",
            new: false,
            uploading: false,
            uploaded: true,
            deleting: false,
            uploadUrl: getGalleryImage(_identify.id, item.name),
            name: item.name
          };
        });
        // console.log(_images);
        setImages(_images);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  const handleShowFileBrowser = () => hiddenFileInput.current.click();

  const handleFileSelected = async (e) => {
    const previewImages = [...images];
    const fileCount = e.target.files.length;
    const lastLength = images.length;

    setWait(true);
    for (let i = 0; i < fileCount; i++) {
      previewImages.push({
        url: "",
        new: true,
        uploading: true,
        deleting: false,
        uploaded: false,
        uploadUrl: "",
        name: ""
      });
    }

    setImages(previewImages);

    let processedCount = 0;
    Array.from(e.target.files).forEach((f, i) => {
      Resizer.imageFileResizer(
        f,
        1000,
        1000,
        "JPEG",
        100,
        0,
        async (uri) => {
          setM(i);
          previewImages[lastLength + i] = {
            url: uri,
            new: true,
            uploading: false,
            deleting: false,
            uploaded: false,
            name: f.name.split(".").slice(0, -1).join(".")
          };
          console.log("Resize done :", f.name);
          setImages(previewImages);

          processedCount++;
          if (processedCount === fileCount) {
            console.log("All done");
            setImages(previewImages);
            setWait(false);
          }
        },
        "blob",
        200,
        200
      );
    });
  };

  const handleUploadCompleted = async (index, url, name) => {
    let newImages = [...images];
    newImages[index].uploading = false;
    newImages[index].new = false;
    newImages[index].uploaded = true;
    newImages[index].uploadUrl = url;
    newImages[index].name = name;
    setImages(newImages);

    const allDone = images.every((current) => current.uploading === false);
    if (allDone) {
      setWait(false);
    }
  };

  const handleSave = () => {
    setWait(true);
    const newImages = [...images];

    let uploadCount = 0;
    images.forEach((image, i) => {
      if (newImages[i].new === true) {
        uploadCount += 1;
        newImages[i].uploading = true;
        uploadAsPromise(
          image.url,
          image.name,
          handleUploadCompleted,
          i,
          identify,
          `gallery/${identify.id}/`
        );
      }
    });
    if (uploadCount === 0) setWait(false);
    setImages(newImages);
  };

  const setDeleting = (index) => {
    const newImages = [...images];
    newImages[index].deleting = true;
    setImages(newImages);
  };

  const setDeleteFail = (index, err) => {
    const newImages = [...images];
    newImages[index].deleting = false;
    setImages(newImages);
  };

  const doDelete = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleTrash = (index) => {
    const newImages = [...images];
    if (images[index].new) {
      doDelete(index);
    } else {
      setDeleting(index);

      storageRef
        .child(`${identify.id}/${newImages[index].name}`)
        .delete()
        .then(() => {
          doDelete(index);
        })
        .catch((err) => {
          console.warn(err);
          setDeleteFail(index, err);
        });
    }
  };
  const uploadedCount = images.reduce(
    (sum, cur) => sum + (cur.uploaded ? 1 : 0),
    0
  );
  return (
    <>
      <header>
        <h1>แกลเลอรี: {identify.title}</h1>
        <p>
          <span>ทั้งหมด {images.length} ภาพ</span>
          {" | "}
          <span>{uploadedCount} อัพโหลดแล้ว</span>
          {" | "}
          <span>{images.length - uploadedCount} ยังไม่ได้อัพโหลด</span>
        </p>
        {/* <h3 className="mt-5"></h3> */}
      </header>

      <Container fluid>
        <Row className="justify-content-center">
          <Col sm="5" md="3">
            <Button
              disabled={wait}
              variant="success"
              className="mb-3"
              block
              onClick={handleShowFileBrowser}
            >
              เพิ่มไฟล์ภาพ
            </Button>
          </Col>
          <Col sm="5" md="3">
            <Button
              disabled={wait}
              variant="primary"
              className="mb-3"
              block
              onClick={handleSave}
            >
              {wait ? (
                <>
                  <Spinner animation="border" size="sm" className="mr-1" />
                  กำลังดำเนินการ...
                </>
              ) : (
                <>อัพโหลดและบันทึก</>
              )}
            </Button>
          </Col>
        </Row>
      </Container>
      <Container className="d-flex flex-row flex-wrap justify-content-center">
        {images.map((image, i) => {
          return (
            <PreviewImage
              key={`preview-${i}`}
              loading={image.uploading || image.deleting}
              uploaded={image.uploaded}
              src={
                (image.url && URL.createObjectURL(image.url)) ||
                image.uploadUrl ||
                UploadingPlaceholder
              }
              onTrash={() => handleTrash(i)}
            />
          );
        })}
      </Container>
      <input
        type="file"
        style={{ display: "none" }}
        ref={hiddenFileInput}
        onChange={handleFileSelected}
        multiple
      />
    </>
  );
};
