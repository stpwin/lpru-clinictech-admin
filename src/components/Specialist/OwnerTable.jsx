import React, { Component } from "react";
import { firebaseAuthContext } from "../../providers/AuthProvider";
import {
  Table,
  Button,
  Spinner,
  OverlayTrigger,
  Tooltip,
  FormControl
} from "react-bootstrap";
import { FaEdit, FaPlus, FaSave, FaSignOutAlt, FaTrash } from "react-icons/fa";
import {
  getAllOwners,
  createOwner,
  updateOwner,
  removeOwner,
  updateOwnerImage
} from "./specialistHelpers";
import { getOwnerImage } from "../../storageHelpers";
import { ImageEdit } from "../ImageEdit";

export class OwnerTable extends Component {
  state = {
    fetching: true,
    fetchFail: "",
    owners: [],
    ownersChange: [],
    edits: []
  };

  async componentDidMount() {
    getAllOwners(await this.context.getToken())
      .then((res) => {
        // console.log(res);
        const edits = res.map((item) => {
          return {
            add: false,
            edit: false,
            processing: false,
            processFail: "",
            delete: false
          };
        });
        this.setState({
          owners: res,
          ownersChange: JSON.parse(JSON.stringify(res)),
          edits,
          fetching: false
        });
      })
      .catch((err) => {
        this.setState({
          fetchFail: err,
          fetching: false
        });
      });
  }

  handleEdit = (index) => {
    let { edits } = this.state;
    edits[index].edit = true;
    this.setState({
      edits
    });
  };
  handleCancelEdit = (index) => {
    const { owners, ownersChange, edits } = this.state;
    edits[index].edit = false;

    console.log(owners[index].name);

    ownersChange[index] = { ...owners[index] };
    if (edits[index].add) {
      owners.splice(index, 1);
      edits.splice(index, 1);
    }

    this.setState({
      edits,
      owners,
      ownersChange
    });
  };

  handleSave = async (index) => {
    let { edits, owners, ownersChange } = this.state;
    edits[index].processing = true;
    edits[index].processFail = "";
    this.setState({
      edits
    });

    owners[index] = { ...ownersChange[index] };

    if (edits[index].add) {
      return createOwner(await this.context.getToken(), owners[index])
        .then((res) => {
          edits[index].processing = false;
          edits[index].edit = false;
          edits[index].add = false;
          owners[index].id = res.owner_id;
          this.setState({
            edits
          });
        })
        .catch((err) => {
          edits[index].processing = false;
          edits[index].processFail = err;
          this.setState({
            edits
          });
        });
    }
    updateOwner(await this.context.getToken(), owners[index])
      .then((res) => {
        edits[index].processing = false;
        edits[index].edit = false;
        this.setState({
          edits
        });
      })
      .catch((err) => {
        edits[index].processing = false;
        edits[index].processFail = err;
        this.setState({
          edits
        });
      });
  };

  handleDelete = (index) => {
    let { edits } = this.state;
    edits[index].delete = true;
    this.setState({
      edits
    });
  };
  handleCancelDelete = (index) => {
    let { edits } = this.state;
    edits[index].delete = false;
    this.setState({
      edits
    });
  };
  handleConfirmDelete = async (index, id) => {
    let { edits } = this.state;
    edits[index].processing = true;
    edits[index].processFail = "";

    this.setState({
      edits
    });
    removeOwner(await this.context.getToken(), id)
      .then((res) => {
        let { owners, edits } = this.state;
        edits[index].processing = false;
        owners.splice(index, 1);
        edits.splice(index, 1);
        this.setState({
          owners,
          edits
        });
      })
      .catch((err) => {
        let { owners, edits } = this.state;
        edits[index].processing = false;
        edits[index].processFail = err;
        this.setState({
          owners,
          edits
        });
      });
  };

  handleNameChanged = (index, value) => {
    const { ownersChange } = this.state;
    ownersChange[index].name = value;
    this.setState({
      ownersChange
    });
  };
  handleEmailChanged = (index, value) => {
    let { ownersChange } = this.state;
    ownersChange[index].email = value;
    this.setState({
      ownersChange
    });
  };
  handlePhoneChanged = (index, value) => {
    let { ownersChange } = this.state;
    ownersChange[index].phone = value;
    this.setState({
      ownersChange
    });
  };
  handlePlaceChanged = (index, value) => {
    let { ownersChange } = this.state;
    ownersChange[index].place = value;
    this.setState({
      ownersChange
    });
  };

  handleImageChange = async (index, id, image) => {
    let { edits, owners } = this.state;
    if (edits[index].add) {
      owners[index].image = image;
      this.setState({
        owners
      });
      return;
    }
    updateOwnerImage(await this.context.getToken(), id, image)
      .then((res) => {
        let { owners } = this.state;
        owners[index].image = image;
        this.setState({
          owners
        });
      })
      .catch((err) => {});
  };

  handleAdd = () => {
    let { owners, edits } = this.state;
    owners.unshift({ name: "", image: "", email: "", phone: "", place: "" });
    edits.unshift({
      add: true,
      edit: true,
      processing: false,
      processFail: "",
      delete: false
    });
    this.setState({ owners, edits });
  };

  render() {
    const { fetching, fetchFail, owners, ownersChange, edits } = this.state;
    return (
      <>
        <header>
          <h1>ข้อมูลเจ้าของ</h1>
        </header>
        {/* <Container className="mt-5"> */}
        <Table striped bordered hover size="sm" className="text-center">
          <thead>
            <tr>
              <th style={{ width: "3%" }}>#</th>
              <th style={{ width: "10%" }}></th>
              <th style={{ width: "25%" }}>ชื่อ</th>
              <th>อีเมล</th>
              <th style={{ width: "10%" }}>โทรศัพท์</th>
              <th>ที่อยู่</th>
              <th>
                <Button
                  className="xs"
                  variant="outline-success"
                  onClick={this.handleAdd}
                  block
                >
                  <FaPlus />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody className="fit-last-cell">
            {fetching ? (
              <tr>
                <td colSpan={7}>
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : fetchFail ? (
              <tr>
                <td className="text-danger" colSpan={7}>
                  {fetchFail}
                </td>
              </tr>
            ) : (
              owners.map((owner, i) => {
                return (
                  <tr key={`owner-${i}`}>
                    <td className="v-center">{i + 1}</td>
                    <td>
                      <ImageEdit
                        width={120}
                        height={120}
                        showFileBrowserOnClick={true}
                        cropAspect={1}
                        path="owner_images"
                        onUploadDone={(imageName) =>
                          this.handleImageChange(i, owner.id, imageName)
                        }
                        thumbnailUrl={
                          (owner &&
                            owner.image &&
                            getOwnerImage(owner.image)) ||
                          "https://via.placeholder.com/120x120?text=No image"
                        }
                      />
                    </td>
                    {edits[i].edit ? (
                      <>
                        <td className="v-center">
                          <FormControl
                            size="sm"
                            maxLength={100}
                            value={ownersChange[i].name}
                            onChange={(e) =>
                              this.handleNameChanged(i, e.target.value)
                            }
                          />
                        </td>
                        <td className="v-center">
                          <FormControl
                            size="sm"
                            maxLength={50}
                            value={ownersChange[i].email}
                            onChange={(e) =>
                              this.handleEmailChanged(i, e.target.value)
                            }
                          />
                        </td>
                        <td className="v-center">
                          <FormControl
                            size="sm"
                            maxLength={15}
                            value={ownersChange[i].phone}
                            onChange={(e) =>
                              this.handlePhoneChanged(i, e.target.value)
                            }
                          />
                        </td>
                        <td className="v-center">
                          <FormControl
                            as="textarea"
                            maxLength={500}
                            rows={3}
                            size="sm"
                            value={ownersChange[i].place}
                            onChange={(e) =>
                              this.handlePlaceChanged(i, e.target.value)
                            }
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="v-center">{owner.name}</td>
                        <td className="v-center">{owner.email}</td>
                        <td className="v-center">{owner.phone}</td>
                        <td className="v-center font-weight-light font-small">
                          {owner.place}
                        </td>
                      </>
                    )}

                    <td>
                      {edits[i].edit ? (
                        <>
                          {edits[i].processFail ? (
                            <OverlayTrigger
                              trigger="hover"
                              placement="right"
                              overlay={
                                <Tooltip id={`tooltip-${i}`}>
                                  {edits[i].processFail}
                                </Tooltip>
                              }
                            >
                              <Button
                                disabled={edits[i].processing}
                                variant="outline-danger"
                                className="xs mr-1"
                                onClick={() => this.handleSave(i)}
                              >
                                {edits[i].processing ? (
                                  <Spinner
                                    size="sm"
                                    animation="border"
                                    className="spinner-border-xs"
                                  />
                                ) : (
                                  <FaSave />
                                )}
                              </Button>
                            </OverlayTrigger>
                          ) : (
                            <Button
                              disabled={edits[i].processing}
                              variant="outline-success"
                              className="xs mr-1"
                              onClick={() => this.handleSave(i)}
                            >
                              {edits[i].processing ? (
                                <Spinner
                                  size="sm"
                                  className="spinner-border-xs"
                                  animation="border"
                                />
                              ) : (
                                <FaSave />
                              )}
                            </Button>
                          )}

                          <Button
                            disabled={edits[i].processing}
                            variant="outline-warning"
                            className="xs"
                            onClick={() => this.handleCancelEdit(i)}
                          >
                            <FaSignOutAlt />
                          </Button>
                        </>
                      ) : edits[i].delete ? (
                        <>
                          {edits[i].processFail ? (
                            <OverlayTrigger
                              trigger="hover"
                              placement="right"
                              overlay={
                                <Tooltip id={`tooltip-${i}`}>
                                  {edits[i].processFail}
                                </Tooltip>
                              }
                            >
                              <Button
                                disabled={edits[i].processing}
                                variant="outline-danger"
                                className="xs mr-1"
                                onClick={() =>
                                  this.handleConfirmDelete(i, owner.id)
                                }
                              >
                                {edits[i].processing ? (
                                  <Spinner
                                    size="sm"
                                    className="spinner-border-xs"
                                    animation="border"
                                  />
                                ) : (
                                  <FaTrash />
                                )}
                              </Button>
                            </OverlayTrigger>
                          ) : (
                            <Button
                              disabled={edits[i].processing}
                              variant="outline-danger"
                              className="xs mr-1"
                              onClick={() =>
                                this.handleConfirmDelete(i, owner.id)
                              }
                            >
                              {edits[i].processing ? (
                                <Spinner
                                  size="sm"
                                  className="spinner-border-xs"
                                  animation="border"
                                />
                              ) : (
                                <FaTrash />
                              )}
                            </Button>
                          )}

                          <Button
                            disabled={edits[i].processing}
                            variant="outline-warning"
                            className="xs"
                            onClick={() => this.handleCancelDelete(i)}
                          >
                            <FaSignOutAlt />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline-warning"
                            className="xs mr-1"
                            onClick={() => this.handleEdit(i)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            variant="outline-danger"
                            className="xs"
                            onClick={() => this.handleDelete(i)}
                          >
                            <FaTrash />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
        {/* </Container> */}
      </>
    );
  }
}

OwnerTable.contextType = firebaseAuthContext;
export default OwnerTable;
