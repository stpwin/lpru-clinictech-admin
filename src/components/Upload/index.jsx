import React, { useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { UploadContainer } from "./UploadContainer";

export const ImageUploadModal = (props) => {
  const uploadRef = useRef();
  const handleUpload = async () => {
    const imageName = await uploadRef.current.Upload(props.path);
    if (!imageName) return;
    if (props.onUploadDone) props.onUploadDone(imageName);
    props.onHide();
  };

  return (
    <>
      <Modal {...props} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>อัพโหลดภาพ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {props.show ? (
            <UploadContainer
              cropAspect={props.cropAspect}
              ref={uploadRef}
              showFileBrowser={props.showFileBrowser}
              // defaultImage={props.defaultImage}
            />
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpload}>อัพโหลด</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
