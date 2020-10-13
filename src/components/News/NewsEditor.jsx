import React, { useEffect, useState, useContext } from "react";
import { useLocation, useHistory } from "react-router-dom";

import { Button, Spinner } from "react-bootstrap";

import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

// import image from "suneditor/src/plugins/dialog/link";
// import list from "suneditor/src/plugins/submenu/list";
// import { font, video } from "suneditor/src/plugins";
import plugins from "suneditor/src/plugins";

import { firebaseAuthContext } from "../../providers/AuthProvider";
import { getNewsById, update } from "./editorHelpers";

export const NewsEditor = () => {
  const location = useLocation();
  const history = useHistory();
  const authContext = useContext(firebaseAuthContext);

  const [identify, setIdentify] = useState({ id: null, title: "" });
  const [value, setValue] = useState("");
  const [dataChanged, setDataChanged] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setDataChanged(true);
  }, [value]);

  useEffect(() => {
    if (error) {
      setSaving(false);
    }
  }, [error]);

  useEffect(() => {
    if (saving) {
      setError("");
    }
  }, [saving]);

  useEffect(() => {
    const _identify = location?.state?.identify;
    if (!_identify) {
      history.push("/news");
      return;
    }
    setIdentify(_identify);
    getNewsById(_identify.id)
      .then((res) => {
        // console.log(res);
        setValue(res.content);
        setDataChanged(false);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, []);

  const handleGoBack = () => {
    history.goBack();
  };

  const handleSave = () => {
    setSaving(true);
    authContext
      .getToken()
      .then((idToken) => {
        update(idToken, { id: identify.id, content: value })
          .then((res) => {
            // console.log(res);
            setSaving(false);
            setDataChanged(false);
          })
          .catch((err) => {
            console.warn(err);
            setError(err);
          });
      })
      .catch((err) => {
        console.warn(err);
        setError(err);
      });
  };

  const handleChange = (_value) => {
    setValue(_value);
  };

  return (
    <>
      <header>
        <h1>ข่าวประชาสัมพันธ์: {identify.title}</h1>
      </header>
      <div style={{ display: "inline-flex " }}>
        <TopButtons
          error={error}
          showLoading={saving}
          saveDisabled={!dataChanged || saving}
          goBackDisabled={saving}
          onGoBack={handleGoBack}
          onSave={handleSave}
        />
      </div>

      <SunEditor
        disable={saving}
        setContents={value}
        height="40rem"
        onChange={handleChange}
        setOptions={{
          plugins: plugins,
          buttonList: [
            ["undo", "redo"],
            ["font", "fontSize", "formatBlock"],
            ["paragraphStyle", "blockquote"],
            [
              "bold",
              "underline",
              "italic",
              "strike",
              "subscript",
              "superscript"
            ],
            ["fontColor", "hiliteColor", "textStyle"],
            ["removeFormat"],
            "/", // Line break
            ["outdent", "indent"],
            ["align", "horizontalRule", "list", "lineHeight"],
            ["table", "link", "image", "video", "audio" /** ,'math' */], // You must add the 'katex' library at options to use the 'math' plugin. // You must add the "imageGalleryUrl".
            /** ['imageGallery'] */ ["fullScreen", "showBlocks", "codeView"],
            ["preview", "print"],
            ["save", "template"]
          ]
        }}
      />

      {/* <ReactQuill
        // children={<div className="quill-editor"></div>}
        readOnly={saving}
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      /> */}
    </>
  );
};

const TopButtons = ({
  goBackDisabled,
  saveDisabled,
  showLoading,
  error,
  onGoBack,
  onSave
}) => {
  return (
    <div className="mb-3">
      <Button
        disabled={goBackDisabled}
        variant="secondary"
        className="mr-2"
        onClick={onGoBack}
      >
        กลับ
      </Button>
      <Button disabled={saveDisabled} variant="success" onClick={onSave}>
        บันทึก
      </Button>
      {showLoading ? (
        <>
          <Spinner size="sm" animation="border" className="ml-3 mr-1" />{" "}
          กำลังบันทึก...
        </>
      ) : error ? (
        <span className="ml-3  text-danger">{`${error}`}</span>
      ) : null}
    </div>
  );
};

export default NewsEditor;
