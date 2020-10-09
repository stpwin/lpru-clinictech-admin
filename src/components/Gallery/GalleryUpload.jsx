import React, { useState, createRef, useEffect, useCallback } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { PreviewImage } from "./PreviewImage";
import Resizer from "react-image-file-resizer";
// import { uploadAsPromise } from "../../fileUpload";
import UploadingPlaceholder from "./Uploading-200.png";

export const GalleryUpload = ({ galleryID, galleryTitle }) => {
  const [images, setImages] = useState([]);
  const [wait, setWait] = useState(false);
  const [m, setM] = useState(0);

  const hiddenFileInput = createRef();

  const uploadAsPromise = (f, callback, index, x, x1, path) => {
    setTimeout(() => callback(index, ""), 1000);
  };

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
        uploaded: false
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
            uploaded: false
          };
          console.log("done index:", lastLength + i);
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

  useEffect(() => {
    console.log("Update on images changed");
  }, [images]);

  const handleUploadCompleted = async (index, url) => {
    let newImages = [...images];
    newImages[index].uploading = false;
    newImages[index].new = false;
    newImages[index].uploaded = true;
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
          image,
          handleUploadCompleted,
          i,
          "",
          "",
          "gallery_images/"
        );
      }
    });
    if (uploadCount === 0) setWait(false);
    setImages(newImages);
  };

  const handleTrash = (index) => {
    const newImages = [...images];
    if (newImages[index].new) {
      newImages.splice(index, 1);
      newImages.splice(index, 1);

      setImages(newImages);
    } else {
      newImages[index].deleting = true;
      setImages(newImages);
    }
  };

  return (
    <>
      <header>
        <h3 className="mt-5">{galleryTitle}</h3>
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
