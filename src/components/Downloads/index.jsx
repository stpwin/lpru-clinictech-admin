import React, { Component, createRef } from "react";
import { Button, Modal, Form, Spinner, Table, Badge } from "react-bootstrap";
import {
  getDownloads,
  createDownload,
  createFiles,
  deleteFile,
  deleteDownload
} from "./downloadsHelper";
import { FaTrash, FaPlus, FaCheck } from "react-icons/fa";
import { firebaseAuthContext } from "../../providers/AuthProvider";

import { uploadAsPromise } from "../../fileUpload";

export class Downloads extends Component {
  state = {
    createDownloadShow: false,
    downloadTitle: "",
    creating: false,
    createFail: "",
    downloads: [],
    fetching: true,
    fetchFail: "",
    uploadShow: false,
    uploadTo: ["", ""],
    uploadList: [],
    uploading: false
  };

  hiddenFileInput = createRef();

  getDownloadList = async () => {
    return getDownloads(await this.context.getToken())
      .then((res) => {
        // console.log(res);
        return this.setState({
          fetching: false,
          downloads: res
        });
      })
      .catch((err) => {
        this.setState({
          fetching: false,
          fetchFail: err
        });
      });
  };

  componentDidMount() {
    this.getDownloadList();
  }

  handleShowCreateDownload = () => {
    this.setState({
      createDownloadShow: true
    });
  };

  handleCloseCreateDownload = () => {
    this.setState({
      createDownloadShow: false
    });
  };

  handleCloseUpload = () => {
    this.setState({ uploadShow: false, uploadTo: ["", ""], uploadList: [] });
    this.getDownloadList();
  };

  handleDownloadTitleChanged = (e) => {
    this.setState({
      downloadTitle: e.target.value
    });
  };

  handleCreateDownloadSubmit = async () => {
    const { downloadTitle } = this.state;
    if (!downloadTitle) {
      return;
    }
    this.setState(
      {
        creating: true,
        createFail: "",
        fetchFail: ""
      },
      async () => {
        createDownload(await this.context.getToken(), downloadTitle)
          .then((res) => {
            this.setState(
              {
                creating: false,
                createDownloadShow: false,
                downloadTitle: ""
              },
              this.getDownloadList
            );
          })
          .catch((err) => {
            this.setState({
              createFail: err,
              creating: false
            });
          });
      }
    );
  };

  handleDeleteDownload = async (downloadsID) => {
    deleteDownload(await this.context.getToken(), downloadsID)
      .then((res) => {
        // console.log(res);
        this.getDownloadList();
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  handleFilesAdd = (downloadsID, downloadName) => {
    // console.log(downloadsID);
    this.setState({ uploadShow: true, uploadTo: [downloadsID, downloadName] });
    this.getDownloadList();
  };

  handleFileDelete = async (fileID) => {
    // console.log(fileID)
    deleteFile(await this.context.getToken(), fileID)
      .then((res) => {
        // console.log(res)
        this.getDownloadList();
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  handleShowFileBrowser = () => this.hiddenFileInput.current.click();

  handleUploadCompleted = async (index, url) => {
    // console.log("Upload complete callback:", url);
    let { uploadList, uploadTo } = this.state;
    if (!uploadList) return;

    uploadList[index].url = url;
    uploadList[index].uploading = false;
    this.setState({
      uploadList
    });

    const allDone = uploadList.every((current) => current.uploading === false);
    // console.log({ allDone });
    if (allDone) {
      this.setState({
        uploading: false
      });
      // console.log("Add to database")
      const files = uploadList.map((file) => {
        return [uploadTo[0], file.name, file.url];
      });
      createFiles(await this.context.getToken(), files)
        .then((res) => {
          // console.log(res)
        })
        .catch((err) => {
          console.warn(err);
        });
    }
  };

  handleFileSelected = (e) => {
    // console.log(e.target.files);
    let { uploadList, uploadTo } = this.state;
    Array.from(e.target.files).forEach((f) => {
      const index =
        uploadList.push({
          uploading: true,
          url: "",
          name: f.name
        }) - 1;
      uploadList[index].task = uploadAsPromise(
        f,
        this.handleUploadCompleted,
        index,
        uploadTo[0],
        uploadTo[1]
      );
    });
    this.setState({
      uploading: true,
      uploadList
    });
  };

  render() {
    const {
      createDownloadShow,
      downloadTitle,
      creating,
      createFail,
      downloads,
      fetching,
      fetchFail,
      uploadShow,
      uploadTo,
      uploadList,
      uploading
    } = this.state;
    return (
      <>
        <header>
          <h1>ดาวน์โหลด</h1>
        </header>
        <Table striped bordered hover size="sm" className="text-center">
          <thead>
            <tr>
              <th style={{ width: "3%" }}>#</th>
              <th style={{ width: "50%" }}>รายการกลุ่มดาวน์โหลด</th>
              <th>รายการไฟล์</th>
              <th>
                <Button
                  className="xs"
                  variant="outline-success"
                  onClick={this.handleShowCreateDownload}
                >
                  <FaPlus />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="fit-last-cell">
            {fetching ? (
              <tr>
                <td colSpan={4}>
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : fetchFail ? (
              <tr>
                <td colSpan={4}>{fetchFail}</td>
              </tr>
            ) : (
              <>
                {downloads.length > 0 ? (
                  downloads.map((ele, i) => {
                    return (
                      <tr key={`downloads-${i}`}>
                        <td>{i + 1}</td>
                        <td>{ele.title}</td>
                        <td>
                          <FilesTable
                            files={ele.files}
                            onAddClick={() =>
                              this.handleFilesAdd(ele.id, ele.title)
                            }
                            onTrashClick={this.handleFileDelete}
                          />
                        </td>
                        <td>
                          <div className="button-group">
                            <Button
                              className="xs"
                              variant="outline-danger"
                              onClick={() => this.handleDeleteDownload(ele.id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="text-center">
                    <td colSpan={4}>ไม่มีรายการ</td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </Table>

        <Modal
          show={createDownloadShow}
          onHide={this.handleCloseCreateDownload}
          animation={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>สร้างกลุ่มดาวน์โหลด</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="downloadTitle">
                <Form.Label>ชื่อกลุ่มดาวน์โหลด</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ตั้งชื่อกลุ่มดาวน์โหลด"
                  maxLength={200}
                  value={downloadTitle}
                  onChange={this.handleDownloadTitleChanged}
                />
                {createFail ? (
                  <Form.Text className="text-danger">{createFail}</Form.Text>
                ) : null}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={this.handleCloseCreateDownload}
            >
              ยกเลิก
            </Button>
            {creating ? (
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                กำลังสร้าง...
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={this.handleCreateDownloadSubmit}
              >
                สร้าง
              </Button>
            )}
          </Modal.Footer>
        </Modal>

        <Modal
          show={uploadShow}
          onHide={this.handleCloseUpload}
          animation={false}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>อัพโหลดไฟล์ไฟยัง {uploadTo[1]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="file"
              style={{ display: "none" }}
              ref={this.hiddenFileInput}
              onChange={this.handleFileSelected}
              multiple
            />
            <Table striped bordered>
              <thead>
                <tr>
                  <th style={{ width: "3%" }}>#</th>
                  <th>รายการไฟล์</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="fit-last-cell">
                <tr>
                  <td colSpan={3} className="text-center">
                    <Button
                      className="xs"
                      variant="outline-success"
                      onClick={this.handleShowFileBrowser}
                    >
                      <FaPlus />
                    </Button>
                  </td>
                </tr>
                {uploadList &&
                  uploadList.map((item, i) => {
                    return (
                      <tr key={`upload-file-${i}`}>
                        <td>{i + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          {item.uploading ? (
                            <Spinner animation="border" size="sm" />
                          ) : (
                            <Badge className="xs" variant="success">
                              <FaCheck />
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              disabled={uploading}
              variant="primary"
              onClick={this.handleCloseUpload}
            >
              {uploading ? (
                <>
                  <Spinner animation="border" size="sm" className="mr-1" />
                  กำลังอัพโหลด
                </>
              ) : (
                <>เสร็จสิ้น</>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

const FilesTable = ({ files, onAddClick, onTrashClick }) => {
  return (
    <Table>
      <tbody className="fit-last-cell">
        <tr>
          <td colSpan={2}>
            <Button
              variant="outline-success"
              className="float-right xs"
              onClick={onAddClick}
            >
              <FaPlus />
            </Button>
          </td>
        </tr>
        {files &&
          files.map((file, i) => {
            return (
              <tr key={`file-${i}`}>
                <td>{file.name}</td>
                <td>
                  <Button
                    className="xs"
                    variant="outline-danger"
                    onClick={() => onTrashClick(file.id)}
                  >
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            );
          })}
      </tbody>
    </Table>
  );
};

Downloads.contextType = firebaseAuthContext;
export default Downloads;
