import React, { useState, useEffect } from "react";
import { Button, Image } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { ImageUploadModal } from "../Upload";

export const ImageEdit = ({
  thumbnailUrl,
  onUploadDone,
  path,
  cropAspect,
  showFileBrowserOnClick,
  width,
  height,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    setImageUrl(thumbnailUrl);
  }, [thumbnailUrl]);

  return (
    <>
      <div className="hover-change">
        <Image width={width || 120} height={height || 90} src={imageUrl} />
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
