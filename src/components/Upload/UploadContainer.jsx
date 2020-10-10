import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect
} from "react";
import Resizer from "react-image-file-resizer";
import Cropper from "react-easy-crop";

import { uploadImage } from "../../fileUpload";
import { Button, Container, Row, Col } from "react-bootstrap";
import getCroppedImg from "../../cropImage";

export const UploadContainer = forwardRef((props, ref) => {
  const [imageUrl, setImageUrl] = useState("");
  const [cropper, setCropper] = useState({
    crop: { x: 0, y: 0 },
    zoom: 1,
    aspect: props.cropAspect
  });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});
  const fileUpload = useRef(null);

  useEffect(() => {
    if (props.showFileBrowser) {
      // fileUpload.current.click();
    } else {
      setImageUrl(props.defaultImage);
    }
  }, [props]);

  useImperativeHandle(ref, () => ({
    Upload: async (path) => {
      const file = fileUpload.current.files[0];
      if (!file) return;
      const cropped = await getCroppedImg(imageUrl, croppedAreaPixels);
      return await uploadImage(cropped, path);
    }
  }));

  const showFileBrowser = () => {
    fileUpload.current.click();
  };

  const handleFileChange = (e) => {
    setCropper({ ...cropper, crop: { x: 0, y: 0 } });
    if (!e.target.files[0]) {
      setImageUrl("");
      return;
    }
    Resizer.imageFileResizer(
      e.target.files[0],
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        setImageUrl(uri);
      },
      "base64",
      300,
      300
    );
  };

  const onCropChange = (crop) => setCropper({ ...cropper, crop });

  const onCropComplete = (croppedArea, croppedAreaPixels) =>
    setCroppedAreaPixels(croppedAreaPixels);

  return (
    <Container>
      <Row>
        <Col>
          {imageUrl ? (
            <div className="crop-container">
              <Cropper
                image={imageUrl}
                crop={cropper.crop}
                zoom={cropper.zoom}
                aspect={cropper.aspect}
                onCropChange={onCropChange}
                onCropComplete={onCropComplete}
              />
            </div>
          ) : null}
        </Col>
      </Row>
      <Row>
        <Col className="mt-2 ml-2">
          <Button size="sm" variant="success" onClick={() => showFileBrowser()}>
            เลือกไฟล์
          </Button>
        </Col>
      </Row>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileUpload}
        onChange={handleFileChange}
        accept="image/x-png,image/gif,image/jpeg"
      />
    </Container>
  );
});
