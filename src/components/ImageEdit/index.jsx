import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { ImageUploadModal } from "../Upload";
import MyImage from "../MyImage";

export const ImageEdit = ({
  thumbnailUrl,
  onUploadDone,
  path,
  cropAspect,
  showFileBrowserOnClick,
  width,
  height
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    setImageUrl(thumbnailUrl);
  }, [thumbnailUrl]);

  return (
    <>
      <div className="hover-change">
        <MyImage width={width} height={height} src={imageUrl} />
        <div className="middle">
          <Button
            size="sm"
            variant="outline-info"
            onClick={() => setShowUpload(true)}
          >
            <FaEdit />
          </Button>
        </div>
      </div>
      <ImageUploadModal
        cropAspect={cropAspect}
        defaultImage={thumbnailUrl}
        onUploadDone={onUploadDone}
        show={showUpload}
        onHide={() => setShowUpload(false)}
        path={path}
        showFileBrowser={showFileBrowserOnClick}
      />
    </>
  );
};
