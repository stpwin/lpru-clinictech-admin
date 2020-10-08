import React, { useState, useEffect } from "react";

import { Image } from "react-bootstrap";

export const MyImage = ({ src, width, height, className }) => {
  const [imageUrl, setImageUrl] = useState(
    `https://via.placeholder.com/${width || 120}x${height || 120}?text=No+image`
  );

  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (src) {
      setImageUrl(src);
    }
  }, [src]);

  const handleError = () => {
    if (!errored) {
      setImageUrl(
        `https://via.placeholder.com/${width || 120}x${
          height || 90
        }/FF9090/FFFFFF?text=Error`
      );
      setErrored(true);
    }
  };

  return (
    <>
      <Image
        className={className}
        loading="lazy"
        width={width || 120}
        height={height || 90}
        src={imageUrl}
        onError={handleError}
        fluid
      />
    </>
  );
};
export default MyImage;
