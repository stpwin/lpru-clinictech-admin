import React, { Component } from "react";
import {
  Table,
  Button,
  Spinner,
  FormControl,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import {
  FaPlus,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaTrash,
  FaEdit,
  FaPenSquare,
  FaArrowCircleRight
} from "react-icons/fa";
import {
  getGallery,
  create,
  setPublic,
  updateInfo,
  updateImage,
  remove
} from "./galleryHelpers";
import { ImageEdit } from "../ImageEdit";
import { getGalleryImage } from "../../helpers";
import { firebaseAuthContext } from "../../providers/AuthProvider";
export class Gallery extends Component {
  state = {
    fetching: true,
    fetchFail: "",
    gallery: [],
    edits: [],
    galleryChange: []
  };

  componentDidMount() {
    getGallery(this.context.token)
      .then((res) => {
        // console.log(res);
        const edits = res.map((item) => {
          return {
            edit: false,
            delete: false,
            add: false,
            _public: false,
            processing: false,
            publicError: "",
            editError: "",
            addError: "",
            deleteError: ""
          };
        });
        this.setState({
          fetching: false,
          gallery: res,
          galleryChange: JSON.parse(JSON.stringify(res)),
          edits
        });
      })
      .catch((err) => {
        this.setState({ fetching: false, fetchFail: err });
      });
  }

  handleAdd = () => {
    let { gallery, galleryChange, edits } = this.state;
    gallery.unshift({
      id: null,
      title: "",
      subtitle: "",
      thumdbImg: null,
      imageCount: 0,
      _public: false
    });

    galleryChange.unshift({
      id: null,
      title: "",
      subtitle: "",
      thumdbImg: null,
      imageCount: 0,
      _public: false
    });

    edits.unshift({
      edit: true,
      delete: false,
      add: true,
      _public: false,
      processing: false,
      publicError: "",
      addEditError: "",
      deleteError: ""
    });
    // console.log(gallery);
    this.setState({
      gallery,
      edits
    });
  };

  handleSave = (index) => {
    let { gallery, galleryChange, edits } = this.state;

    edits[index].processing = true;
    edits[index].addEditError = "";
    this.setState({
      edits
    });

    if (edits[index].add) {
      //   Create new function here
      create(this.context.token, galleryChange[index])
        .then((res) => {
          edits[index].processing = false;
          edits[index].edit = false;
          edits[index].add = false;
          galleryChange[index].id = res.id;
          galleryChange[index].created = res.created;
          gallery[index] = { ...galleryChange[index] };
          this.setState({
            gallery,
            edits
          });
        })
        .catch((err) => {
          edits[index].processing = false;
          edits[index].addEditError = err;
          this.setState({
            edits
          });
        });
      return;
    }

    //Update function here
    updateInfo(
      this.context.token,
      gallery[index].id,
      galleryChange[index].title,
      galleryChange[index].subtitle
    )
      .then((res) => {
        edits[index].processing = false;
        edits[index].edit = false;
        gallery[index] = { ...galleryChange[index] };
        this.setState({
          gallery,
          edits
        });
      })
      .catch((err) => {
        edits[index].processing = false;
        edits[index].addEditError = err;
        this.setState({
          edits
        });
      });
  };

  handleCancelSave = (index) => {
    const { gallery, galleryChange, edits } = this.state;

    if (edits[index].add) {
      gallery.splice(index, 1);
      edits.splice(index, 1);
      this.setState({
        gallery,
        edits
      });
      return;
    }

    galleryChange[index].title = gallery[index].title;
    galleryChange[index].subtitle = gallery[index].subtitle;

    console.log(gallery[index].title);
    edits[index].edit = false;
    this.setState({
      galleryChange,
      edits
    });
  };

  handleToggleShowPublic = (index) => {
    const { gallery, edits } = this.state;

    if (edits[index].add) {
      gallery[index]._public = !gallery[index]._public;
      this.setState({
        gallery
      });
      return;
    }

    //Update function here
    edits[index].processing = true;
    edits[index].publicError = "";
    edits[index].deleteError = "";
    this.setState({
      edits
    });
    const newPublic = !gallery[index]._public;
    setPublic(this.context.token, gallery[index].id, newPublic)
      .then((res) => {
        gallery[index]._public = !gallery[index]._public;
        edits[index].processing = false;
        console.log(res);
        this.setState({
          gallery,
          edits
        });
      })
      .catch((err) => {
        edits[index].processing = false;
        edits[index].publicError = err;
        this.setState({
          edits,
          gallery
        });
      });
  };

  handleTitleChange = (index, value) => {
    const { galleryChange } = this.state;
    galleryChange[index].title = value;
    this.setState({
      galleryChange
    });
  };

  handleSubTitleChange = (index, value) => {
    const { galleryChange } = this.state;
    galleryChange[index].subtitle = value;
    this.setState({
      galleryChange
    });
  };

  handleEdit = (index) => {
    let { edits } = this.state;
    edits[index].edit = true;
    edits[index].deleteError = "";
    this.setState({
      edits
    });
  };

  handleRemove = (index) => {
    const { edits } = this.state;
    edits[index].delete = true;
    this.setState({
      edits
    });
  };

  handleCancelRemove = (index) => {
    const { edits } = this.state;
    edits[index].delete = false;
    this.setState({
      edits
    });
  };

  handleConfirmRemove = (index) => {
    const { edits, gallery, galleryChange } = this.state;
    edits[index].processing = true;
    edits[index].deleteError = "";
    this.setState({
      edits
    });

    remove(this.context.token, gallery[index].id)
      .then((res) => {
        gallery.splice(index, 1);
        edits.splice(index, 1);
        galleryChange.splice(index, 1);
        this.setState({
          gallery,
          edits
        });
      })
      .catch((err) => {
        edits[index].processing = false;
        edits[index].deleteError = err;
        this.setState({
          edits
        });
      });
  };

  handleImageChange = (index, image) => {
    const { edits, gallery, galleryChange } = this.state;
    if (edits[index].add) {
      gallery[index].thumdbImg = image;
      galleryChange[index].thumdbImg = image;
      this.setState({
        gallery
      });
      return;
    }
    updateImage(this.context.token, gallery[index].id, image)
      .then((res) => {
        const { gallery, galleryChange } = this.state;
        gallery[index].thumdbImg = image;
        galleryChange[index].thumdbImg = image;
        this.setState({
          gallery,
          galleryChange
        });
      })
      .catch((err) => {});
  };

  handleEditContent = (index) => {};

  render() {
    const { gallery, galleryChange, edits, fetching, fetchFail } = this.state;
    return (
      <>
        <header>
          <h1>แกลเลอรี</h1>
        </header>
        <Table
          responsive="sm"
          striped
          bordered
          hover
          size="sm"
          className="text-center"
        >
          <thead>
            <tr>
              <th style={{ width: "3%" }}>#</th>
              <th style={{ width: "10%" }}></th>
              <th style={{ width: "30%" }}>หัวข้อ</th>
              <th>หัวข้อรอง</th>
              <th>สร้าง</th>
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
                <td colSpan={6}>
                  <Spinner animation="border" />
                </td>
              </tr>
            ) : fetchFail ? (
              <tr>
                <td className="text-danger" colSpan={6}>
                  {`${fetchFail}`}
                </td>
              </tr>
            ) : gallery.length > 0 ? (
              gallery.map((item, i) => {
                return (
                  <tr key={`gallery-${i}`}>
                    <td className="v-center">{i + 1}</td>
                    <td>
                      <ImageEdit
                        width={120}
                        height={120}
                        showFileBrowserOnClick={true}
                        cropAspect={1}
                        path="gallery_images"
                        onUploadDone={(imageName) =>
                          this.handleImageChange(i, imageName)
                        }
                        thumbnailUrl={
                          (item &&
                            item.thumdbImg &&
                            getGalleryImage(item.thumdbImg)) ||
                          "https://via.placeholder.com/120x120?text=No image"
                        }
                      />
                    </td>
                    {edits[i].edit ? (
                      <>
                        <td className="v-center">
                          <FormControl
                            disabled={edits[i].processing}
                            value={galleryChange[i].title}
                            size="sm"
                            onChange={(e) =>
                              this.handleTitleChange(i, e.target.value)
                            }
                          />
                          {edits[i].addEditError ? (
                            <p className="text-danger pt-1">{`${edits[i].addEditError}`}</p>
                          ) : null}
                        </td>
                        <td className="v-center">
                          <FormControl
                            disabled={edits[i].processing}
                            value={galleryChange[i].subtitle}
                            size="sm"
                            onChange={(e) =>
                              this.handleSubTitleChange(i, e.target.value)
                            }
                          />
                        </td>
                        <td className="v-center">{item.created}</td>
                        <td className="v-center">
                          <ConfirmButton
                            loading={edits[i].processing}
                            onConfirmClick={() => this.handleSave(i)}
                            onCancelClick={() => this.handleCancelSave(i)}
                            confirmVariant="outline-success"
                            confirmIcon={<FaSave />}
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="v-center">
                          {item.title}
                          {edits[i].deleteError ? (
                            <p className="text-danger pt-1">{`${edits[i].deleteError}`}</p>
                          ) : null}
                        </td>

                        <td className="v-center"> {item.subtitle}</td>
                        <td className="v-center">{item.created}</td>
                        <td className="v-center">
                          {edits[i].delete ? (
                            <ConfirmButton
                              loading={edits[i].processing}
                              onConfirmClick={() => this.handleConfirmRemove(i)}
                              onCancelClick={() => this.handleCancelRemove(i)}
                              confirmVariant="outline-danger"
                              confirmIcon={<FaTrash />}
                            />
                          ) : (
                            <>
                              <PublicButton
                                _key={i}
                                error={edits[i].publicError}
                                loading={edits[i].processing}
                                isPublic={item._public}
                                onClick={() => this.handleToggleShowPublic(i)}
                              />
                              <Button
                                variant="outline-info"
                                className="xs mr-1"
                                onClick={() => this.handleEdit(i)}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-dark"
                                className="xs mr-1"
                                onClick={() => this.handleEditContent(i)}
                              >
                                <FaPenSquare />
                              </Button>
                              <Button
                                variant="outline-danger"
                                className="xs"
                                onClick={() => this.handleRemove(i)}
                              >
                                <FaTrash />
                              </Button>
                            </>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6}>ไม่มีรายการ</td>
              </tr>
            )}
          </tbody>
        </Table>
      </>
    );
  }
}

const ConfirmButton = ({
  loading,
  onConfirmClick,
  onCancelClick,
  confirmVariant,
  confirmIcon
}) => {
  return (
    <>
      <Button
        disabled={loading}
        variant={`${confirmVariant} mr-1`}
        className="xs"
        onClick={() => onConfirmClick()}
      >
        {loading ? (
          <Spinner className="spinner-border-xs" animation="border" />
        ) : (
          confirmIcon
        )}
      </Button>
      <Button
        disabled={loading}
        variant="outline-primary"
        className="xs"
        onClick={() => onCancelClick()}
      >
        <FaArrowCircleRight />
      </Button>
    </>
  );
};

const PublicButton = ({ _key, isPublic, onClick, loading, error }) => {
  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement="auto"
      overlay={
        <Tooltip
          id={`tooltip-${_key}`}
          className={`${error ? "tooltip-danger" : ""}`}
        >
          {error || (isPublic ? "สถานะ: แสดงสาธารณะ" : "สถานะ: ซ่อนจากสาธารณะ")}
        </Tooltip>
      }
    >
      <Button
        disabled={loading}
        variant={`${
          error
            ? "outline-danger"
            : isPublic
            ? "outline-primary"
            : "outline-secondary"
        } mr-1`}
        className="xs"
        onClick={onClick}
      >
        {loading ? (
          <Spinner className="spinner-border-xs" animation="border" />
        ) : isPublic ? (
          <FaEye />
        ) : (
          <FaEyeSlash />
        )}
      </Button>
    </OverlayTrigger>
  );
};

Gallery.contextType = firebaseAuthContext;
export default Gallery;
