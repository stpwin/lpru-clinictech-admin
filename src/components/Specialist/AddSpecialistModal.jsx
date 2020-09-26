import React from "react";
import {
  Container,
  Button,
  Spinner,
  Row,
  Col,
  Modal,
  Form,
} from "react-bootstrap";
// import { FaPlus, FaTrash, FaSave, FaEdit } from "react-icons/fa";
import Cropper from "react-easy-crop";

export const AddSpecialistModal = ({
  show,
  onHide,
  onOk,
  title,
  image,
  onTitleChange,
  onShowFileBrowser,
  crop,
  onCropChange,
  onCropComplete,
  creating,
  createFail
}) => {
  return (
    <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>เพิ่มข้อมูลผู้เชี่ยวชาญ</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Label>หัวข้อ</Form.Label>
                  <Form.Control
                    type='text'
                    value={title}
                    onChange={onTitleChange}
                    disabled={creating}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col className='mb-2'>รูปภาพ</Col>
          </Row>
          <Row>
            {image ? (
              <Col>
                <div className='crop-container'>
                  <Cropper
                    image={image}
                    crop={crop.crop}
                    zoom={crop.zoom}
                    aspect={crop.aspect}
                    onCropChange={onCropChange}
                    onCropComplete={onCropComplete}
                  />
                </div>
              </Col>
            ) : null}

            <Col sm='auto' className='align-self-center'>
              <Button onClick={onShowFileBrowser} disabled={creating}>
                เลือกภาพ
              </Button>
            </Col>
          </Row>
          <Row className='mt-2'>
            <Col>
              <span className='text-danger'>{`${createFail}`}</span>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        {creating ? (
          <Button variant='secondary' disabled>
            <Spinner
              as='span'
              animation='border'
              size='sm'
              role='status'
              aria-hidden='true'
              className='mr-1'
            />
            กำลังเพิ่ม
          </Button>
        ) : (
          <Button variant='success' onClick={onOk}>
            เสร็จสิ้น
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};