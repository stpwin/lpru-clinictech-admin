import React, { Component, createRef } from "react";
import { Table, Button, Spinner, Row, Col } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import Resizer from "react-image-file-resizer";
import { firebaseAuthContext } from "../../providers/AuthProvider";
import {
  getSpecialist,
  createSpecialist,
  changeTitle,
  changeImage,
  removeSpecialist,
  addDescription,
  removeDescription,
  addOwner,
  createOwner,
  removeOwnerSpecialist
} from "./specialistHelpers";

import { getSpecialistImage } from "../../helpers";
import getCroppedImg from "../../cropImage";
import { uploadImage } from "../../fileUpload";

import { AddSpecialistModal } from "./AddSpecialistModal";
import { Description } from "./Description";
import { Owners } from "./Owners";
import { TitleEdit } from "./TitleEdit";
import { ImageEdit } from "../ImageEdit";
import { AddOwnerModal } from "./AddOwnerModal";

export class Specialist extends Component {
  state = {
    fetching: true,
    fetchFail: "",
    specialist: [],
    showAddSpecialist: false,
    specialistTitle: "",
    specialistImageUrl: "",
    creating: false,
    createFail: "",
    removingList: [],
    crop: {
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 4 / 3,
      croppedAreaPixels: {}
    },
    descriptionText: [],
    addingDescriptionList: [],
    removingDescriptionList: {},
    showAddOwner: false,
    ownersSuggestion: [],
    ownerAddSpecialistId: null,
    currentAddOwnerIndex: null
  };

  uploadFileRef = createRef();
  suggestionRef = createRef();

  handleCropChange = (crop) => {
    this.setState({
      crop: { ...this.state.crop, crop }
    });
  };

  handleCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({
      crop: { ...this.state.crop, croppedAreaPixels }
    });
  };

  fetchSpecialist = async () => {
    this.setState({
      specialist: [],
      fetching: true,
      createFail: "",
      removingDescriptionList: {}
    });
    getSpecialist(await this.context.getToken())
      .then((res) => {
        this.setState({
          specialist: res,
          fetching: false,
          removingDescriptionList: {}
        });
        // console.log(res);
      })
      .catch((err) => {
        this.setState({
          fetchFail: err,
          fetching: false
        });
      });
  };

  componentDidMount() {
    this.fetchSpecialist();
  }

  handleShowAddSpecialist = () => {
    this.setState({
      specialistTitle: "",
      specialistImageUrl: "",
      showAddSpecialist: true
    });
  };

  handleHideAddSpecialist = () => {
    this.setState({
      showAddSpecialist: false
    });
  };

  handleAddSpecialistTitleChange = (e) => {
    this.setState({
      specialistTitle: e.target.value
    });
  };

  handleAddSpecialist = async () => {
    const {
      specialistTitle,
      specialistImageUrl,
      crop: { croppedAreaPixels }
    } = this.state;
    if (!specialistTitle) return;

    this.setState({
      creating: true,
      createFail: ""
    });

    let imageUrl = "";
    let newSpecialist = {
      id: "",
      title: specialistTitle,
      descriptions: [],
      descriptionIDs: [],
      owner: [],
      thumbnail: "",
      created: null
    };
    //upload image
    if (specialistImageUrl) {
      try {
        const cropped = await getCroppedImg(
          specialistImageUrl,
          croppedAreaPixels
        );
        imageUrl = await uploadImage(cropped, "specialist_images");
      } catch (e) {
        console.warn(e);
        this.setState({
          creating: false,
          createFail: e
        });
        return;
      }
    }
    createSpecialist(await this.context.getToken(), specialistTitle, imageUrl)
      .then((res) => {
        // console.log(res);
        newSpecialist.thumbnail = imageUrl;
        newSpecialist.id = res.specialist_id;
        newSpecialist.created = res.created;
        // console.log({ newSpecialist });
        // console.log("Old specialist length:", this.state.specialist.length);
        let newSpecialists = this.state.specialist;
        newSpecialists.unshift(newSpecialist);
        this.setState(
          {
            creating: false,
            createFail: "",
            specialist: newSpecialists
            // removingDescriptionList: {},
          },
          this.handleHideAddSpecialist
        );
      })
      .catch((err) => {
        this.setState({
          creating: false,
          createFail: err
        });
      });
  };

  handleRemoveSpecialist = async (index, id) => {
    // console.log({ index, id });
    let { specialist, removingList, removingDescriptionList } = this.state;
    removingList[index] = true;
    this.setState({
      removingList
    });
    removeSpecialist(await this.context.getToken(), id)
      .then((res) => {
        delete specialist[index];
        delete removingList[index];
        delete removingDescriptionList[index];
        this.setState({
          specialist,
          removingList,
          removingDescriptionList
        });
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  handleAddDescription = async (index, id, inputRef) => {
    let { specialist, descriptionText, addingDescriptionList } = this.state;
    const descValue = descriptionText[index];
    if (!descValue) return;
    addingDescriptionList[index] = true;
    this.setState({
      addingDescriptionList
    });
    addDescription(await this.context.getToken(), id, descValue)
      .then((res) => {
        let { addingDescriptionList } = this.state;
        delete addingDescriptionList[index];
        const { description_id } = res;
        specialist[index].descriptions.push(descValue);
        specialist[index].descriptionIDs.push(description_id);
        descriptionText[index] = "";
        inputRef.value = "";
        this.setState({
          specialist,
          descriptionText,
          addingDescriptionList
        });
      })
      .catch((err) => {
        let { addingDescriptionList } = this.state;
        delete addingDescriptionList[index];
        this.setState({
          addingDescriptionList
        });
        console.warn(err);
      });
    // console.log({ sid, desc: descriptionText[sid] });
  };

  inputTimeout = null;
  handleDescriptionChanged = (value, index) => {
    clearTimeout(this.inputTimeout);
    this.inputTimeout = setTimeout(
      function () {
        let { descriptionText } = this.state;
        descriptionText[index] = value;
        // console.log("CHANGE");
        this.setState({
          descriptionText
        });
        this.inputTimeout = null;
      }.bind(this),
      200
    );
  };

  handleRemoveDescription = async (sindex, index, id) => {
    // console.log({ sindex, index });

    const { removingDescriptionList } = this.state;

    // console.log(removingDescriptionList)
    if (removingDescriptionList[sindex]) {
      removingDescriptionList[sindex] = {
        ...removingDescriptionList[sindex],
        ...{ [index]: true }
      };
    } else {
      removingDescriptionList[sindex] = {};
      removingDescriptionList[sindex][index] = true;
    }

    // console.log(removingDescriptionList);
    this.setState({
      removingDescriptionList
    });
    removeDescription(await this.context.getToken(), id)
      .then((res) => {
        // console.log(res);
        let { specialist, removingDescriptionList } = this.state;
        delete specialist[sindex].descriptions[index];
        delete specialist[sindex].descriptionIDs[index];
        delete removingDescriptionList[sindex][index];
        this.setState({
          specialist,
          removingDescriptionList
        });
      })
      .catch((err) => {});
  };

  handleAddOwner = async ({ id, name, image }) => {
    // console.log({ id, image, name });
    let { specialist, ownerAddSpecialistId, currentAddOwnerIndex } = this.state;
    if (!id) {
      // console.log("Create new");
      return createOwner(await this.context.getToken(), { name, image })
        .then(async (res) => {
          this.suggestionRef.current.Clear();
          addOwner(
            await this.context.getToken(),
            ownerAddSpecialistId,
            res.owner_id
          )
            .then((res) => {
              specialist[currentAddOwnerIndex].owner.push({
                id: res.owner_id,
                image,
                name
              });
              this.setState({
                showAddOwner: false,
                ownerAddSpecialistId: null,
                currentAddOwnerIndex: null,
                specialist
              });
              // console.log(res);
            })
            .catch((err) => {
              this.suggestionRef.current.SetError(err);
              // console.warn(err)
            });
        })
        .catch((err) => {
          this.suggestionRef.current.SetError(err);
          // console.warn(err)
        });
    }
    // console.log("Add");
    addOwner(ownerAddSpecialistId, id)
      .then((res) => {
        this.suggestionRef.current.Clear();
        specialist[currentAddOwnerIndex].owner.push({
          id: res.owner_id,
          image,
          name
        });
        this.setState({
          showAddOwner: false,
          ownerAddSpecialistId: null,
          currentAddOwnerIndex: null,
          specialist
        });
        // console.log(res);
      })
      .catch((err) => {
        this.suggestionRef.current.SetError(err);
        // console.warn(err)
      });
  };

  handleShowAddOwner = async (currentAddOwnerIndex, specialistID) => {
    // console.log({ specialistID });
    this.setState({
      showAddOwner: true,
      ownerAddSpecialistId: specialistID,
      currentAddOwnerIndex
    });
    this.suggestionRef.current.Clear();
    this.suggestionRef.current.FetchOwners(
      await this.context.getToken(),
      specialistID
    );
  };

  handleRemoveOwner = async (sindex, index, id) => {
    // console.log({ sindex, index, id });

    let specialist = this.state.specialist;
    removeOwnerSpecialist(await this.context.getToken(), id)
      .then((res) => {
        delete specialist[sindex].owner[index];
        this.setState({
          specialist
        });
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  handleFileSelected = (e) => {
    Resizer.imageFileResizer(
      e.target.files[0],
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        this.setState({
          crop: { ...this.state.crop, crop: { x: 0, y: 0 } },
          specialistImageUrl: uri
        });
      },
      "base64",
      200,
      200
    );
  };

  handleTitleChangeSave = async (sid, title, callback) => {
    changeTitle(await this.context.getToken(), sid, title)
      .then((res) => {
        callback(title);
      })
      .catch((err) => {
        callback("", err);
      });
  };

  handleImageChangeSave = async (index, sid, imageName) => {
    changeImage(await this.context.getToken(), sid, imageName)
      .then((res) => {
        let { specialist } = this.state;
        specialist[index].thumbnail = imageName;
        this.setState({
          specialist
        });
      })
      .catch((err) => {});
    // console.log({ sid, imageName });
  };

  render() {
    const {
      fetching,
      fetchFail,
      specialist,
      showAddSpecialist,
      specialistImageUrl,
      specialistTitle,
      crop,
      creating,
      createFail,
      removingList,
      addingDescriptionList,
      removingDescriptionList,
      showAddOwner,
      ownersSuggestion
    } = this.state;
    return (
      <>
        <header>
          <h1>ข้อมูลผู้เชี่ยวชาญ</h1>
        </header>
        {/* <Container> */}
        <Table bordered striped hover size="sm" className="text-center">
          <thead>
            <tr>
              <th style={{ width: "3%" }}>#</th>
              <th>รายการ</th>
              <th style={{ width: "30%" }}>เจ้าของ</th>
              <th>
                <Button
                  block
                  className="xs"
                  variant="outline-success"
                  onClick={this.handleShowAddSpecialist}
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
                <td className="text-danger" colSpan={4}>
                  {fetchFail}
                </td>
              </tr>
            ) : (
              <>
                {specialist &&
                  specialist.map((ele, i) => {
                    // console.log(ele)
                    if (!ele) {
                      // console.log("Specialist length", specialist.length);
                      // console.log("null on index", i);
                      return null;
                    }
                    let inputRef = null;
                    return (
                      <tr key={`specialist-${i}`}>
                        <td className="v-center">{i + 1}</td>
                        <td>
                          <Row className="mx-0">
                            <Col sm="auto" className="my-auto">
                              <ImageEdit
                                showFileBrowserOnClick={true}
                                cropAspect={4 / 3}
                                path="specialist_images"
                                onUploadDone={(imageName) =>
                                  this.handleImageChangeSave(
                                    i,
                                    ele.id,
                                    imageName
                                  )
                                }
                                thumbnailUrl={
                                  (ele &&
                                    ele.thumbnail &&
                                    getSpecialistImage(ele.thumbnail)) ||
                                  "https://via.placeholder.com/120x90?text=No image"
                                }
                              />
                            </Col>
                            <Col>
                              <div
                                className="font-weight-bold my-2 text-left text-wrap"
                                style={{ overflowWrap: "anywhere" }}
                              >
                                <TitleEdit
                                  title={ele.title}
                                  onSave={(title, callback) =>
                                    this.handleTitleChangeSave(
                                      ele.id,
                                      title,
                                      callback
                                    )
                                  }
                                />
                              </div>
                              <Description
                                sindex={i}
                                descriptions={ele.descriptions}
                                descriptionIDs={ele.descriptionIDs}
                                adding={addingDescriptionList[i]}
                                deleting={removingDescriptionList[i]}
                                onTrash={this.handleRemoveDescription}
                                onAdd={() =>
                                  this.handleAddDescription(i, ele.id, inputRef)
                                }
                                setRef={(ref) => (inputRef = ref)}
                                onChange={this.handleDescriptionChanged}
                              />
                            </Col>
                          </Row>
                        </td>
                        <td>
                          <Owners
                            sindex={i}
                            data={ele.owner}
                            onTrash={this.handleRemoveOwner}
                            onAdd={() => this.handleShowAddOwner(i, ele.id)}
                          />
                        </td>
                        <td>
                          <div className="button-group">
                            {removingList[i] ? (
                              <Button
                                className="xs"
                                variant="outline-danger"
                                disabled
                              >
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              </Button>
                            ) : (
                              <Button
                                className="xs"
                                variant="outline-danger"
                                onClick={() =>
                                  this.handleRemoveSpecialist(i, ele.id)
                                }
                              >
                                <FaTrash />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </>
            )}
          </tbody>
        </Table>
        <AddSpecialistModal
          show={showAddSpecialist}
          title={specialistTitle}
          image={specialistImageUrl}
          creating={creating}
          createFail={createFail}
          crop={crop}
          onCropChange={this.handleCropChange}
          onCropComplete={this.handleCropComplete}
          onOk={this.handleAddSpecialist}
          onHide={this.handleHideAddSpecialist}
          onTitleChange={this.handleAddSpecialistTitleChange}
          onShowFileBrowser={() => this.uploadFileRef.current.click()}
        />
        <AddOwnerModal
          ref={this.suggestionRef}
          show={showAddOwner}
          owners={ownersSuggestion}
          onHide={() => this.setState({ showAddOwner: false })}
          onSave={this.handleAddOwner}
        />
        <input
          type="file"
          style={{ display: "none" }}
          ref={this.uploadFileRef}
          onChange={this.handleFileSelected}
          accept="image/x-png,image/gif,image/jpeg"
        />
        {/* </Container> */}
      </>
    );
  }
}
Specialist.contextType = firebaseAuthContext;
export default Specialist;
