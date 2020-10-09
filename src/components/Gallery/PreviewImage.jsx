import React from "react";
import { Image, Button, Spinner } from "react-bootstrap";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

export const PreviewImage = ({ src, loading, uploaded, onTrash }) => {
  return (
    <>
      {loading ? (
        <div className="trashed">
          <Image thumbnail width={200} height={200} src={src} />
          <div className="middle">
            <Spinner animation="border" />
          </div>
        </div>
      ) : (
        <div className="hover-change">
          <Image thumbnail width={200} height={200} src={src} />
          {uploaded ? (
            <div className="uploaded">
              <FaCheckCircle />
            </div>
          ) : null}

          <div className="middle">
            <Button
              size="sm"
              variant="danger"
              onClick={() => onTrash && onTrash()}
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
