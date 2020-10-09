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
  create,
  getNews,
  setPublic,
  updateInfo,
  remove,
  updateImage
} from "./newsHelpers";
import { ImageEdit } from "../ImageEdit";
import { getNewsImage } from "../../storageHelpers";
import NewsEditor from "./NewsEditor";
import { firebaseAuthContext } from "../../providers/AuthProvider";
export class News extends Component {
  state = {
    fetching: true,
    fetchFail: "",
    news: [],
    edits: [],
    newsChange: []
  };

  async componentDidMount() {
    getNews(await this.context.getToken())
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
          news: res,
          newsChange: JSON.parse(JSON.stringify(res)),
          edits
        });
      })
      .catch((err) => {
        this.setState({ fetching: false, fetchFail: err });
      });
  }

  handleAdd = () => {
    let { news, newsChange, edits } = this.state;
    news.unshift({
      id: null,
      title: "",
      subtitle: "",
      thumdbImg: null,
      linkTo: null,
      content: null,
      _public: false
    });

    newsChange.unshift({
      id: null,
      title: "",
      subtitle: "",
      thumdbImg: null,
      linkTo: null,
      content: null,
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
    // console.log(news);
    this.setState({
      news,
      edits
    });
  };

  handleSave = async (index) => {
    let { news, newsChange, edits } = this.state;

    edits[index].processing = true;
    edits[index].addEditError = "";
    this.setState({
      edits
    });

    if (edits[index].add) {
      //Create new function here
      create(await this.context.getToken(), newsChange[index])
        .then((res) => {
          edits[index].processing = false;
          edits[index].edit = false;
          edits[index].add = false;
          newsChange[index].id = res.id;
          news[index] = { ...newsChange[index] };
          this.setState({
            news,
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
      await this.context.getToken(),
      news[index].id,
      newsChange[index].title,
      newsChange[index].subtitle
    )
      .then((res) => {
        edits[index].processing = false;
        edits[index].edit = false;
        news[index] = { ...newsChange[index] };
        this.setState({
          news,
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
    const { news, newsChange, edits } = this.state;

    if (edits[index].add) {
      news.splice(index, 1);
      edits.splice(index, 1);
      this.setState({
        news,
        edits
      });
      return;
    }

    newsChange[index].title = news[index].title;
    newsChange[index].subtitle = news[index].subtitle;

    console.log(news[index].title);
    edits[index].edit = false;
    this.setState({
      newsChange,
      edits
    });
  };

  handleToggleShowPublic = async (index) => {
    const { news, edits } = this.state;

    if (edits[index].add) {
      news[index]._public = !news[index]._public;
      this.setState({
        news
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
    const newPublic = !news[index]._public;
    setPublic(await this.context.getToken(), news[index].id, newPublic)
      .then((res) => {
        news[index]._public = !news[index]._public;
        edits[index].processing = false;
        console.log(res);
        this.setState({
          news,
          edits
        });
      })
      .catch((err) => {
        edits[index].processing = false;
        edits[index].publicError = err;
        this.setState({
          edits,
          news
        });
      });
  };

  handleTitleChange = (index, value) => {
    const { newsChange } = this.state;
    newsChange[index].title = value;
    this.setState({
      newsChange
    });
  };

  handleSubTitleChange = (index, value) => {
    const { newsChange } = this.state;
    newsChange[index].subtitle = value;
    this.setState({
      newsChange
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

  handleConfirmRemove = async (index) => {
    const { edits, news, newsChange } = this.state;
    edits[index].processing = true;
    edits[index].deleteError = "";
    this.setState({
      edits
    });

    remove(await this.context.getToken(), news[index].id)
      .then((res) => {
        news.splice(index, 1);
        edits.splice(index, 1);
        newsChange.splice(index, 1);
        this.setState({
          news,
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

  handleImageChange = async (index, image) => {
    const { edits, news, newsChange } = this.state;
    if (edits[index].add) {
      news[index].thumdbImg = image;
      newsChange[index].thumdbImg = image;
      this.setState({
        news
      });
      return;
    }
    updateImage(await this.context.getToken(), news[index].id, image)
      .then((res) => {
        const { news, newsChange } = this.state;
        news[index].thumdbImg = image;
        newsChange[index].thumdbImg = image;
        this.setState({
          news,
          newsChange
        });
      })
      .catch((err) => {});
  };

  handleEditContent = (index) => {};

  render() {
    const { news, newsChange, edits, fetching, fetchFail } = this.state;
    return (
      <>
        <header>
          <h1>ข่าวสาร</h1>
        </header>
        <NewsEditor />
        <Table striped bordered hover size="sm" className="text-center">
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
            ) : news.length > 0 ? (
              news.map((item, i) => {
                return (
                  <tr key={`news-${i}`}>
                    <td className="v-center">{i + 1}</td>
                    <td>
                      <ImageEdit
                        width={120}
                        height={120}
                        showFileBrowserOnClick={true}
                        cropAspect={1}
                        path="news_images"
                        onUploadDone={(imageName) =>
                          this.handleImageChange(i, imageName)
                        }
                        thumbnailUrl={
                          (item &&
                            item.thumdbImg &&
                            getNewsImage(item.thumdbImg)) ||
                          "https://via.placeholder.com/120x120?text=No image"
                        }
                      />
                    </td>
                    {edits[i].edit ? (
                      <>
                        <td className="v-center">
                          <FormControl
                            disabled={edits[i].processing}
                            value={newsChange[i].title}
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
                            value={newsChange[i].subtitle}
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

News.contextType = firebaseAuthContext;
export default News;
