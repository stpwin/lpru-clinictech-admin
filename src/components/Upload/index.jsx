import React, { useRef } from 'react'
import { Modal, Button } from 'react-bootstrap';
import { UploadContainer } from "./UploadContainer"

export const ImageUploadModal = (props) => {
  const uploadRef = useRef()
  const handleUpload = async () => {
    const imageName = await uploadRef.current.Upload();
    // console.log("Done")
    if (props.onUploadDone) props.onUploadDone(imageName);
    props.onHide();
  }

  return (
    <>
      <Modal {...props} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>อัพโหลดภาพ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UploadContainer
            ref={uploadRef}
            // defaultImage={props.defaultImage}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleUpload}>
            อัพโหลด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
