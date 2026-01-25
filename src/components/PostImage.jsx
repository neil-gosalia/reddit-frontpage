import { useState } from "react";

function PostImage({ src }) {
  const [orientation, setOrientation] = useState("landscape");

  return (
    <div className={`post-image-container ${orientation}`}>
      <img
        src={src}
        alt="Post"
        className="post-image"
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.target;

          if (naturalWidth > naturalHeight) {
            setOrientation("landscape");
          } else if (naturalHeight > naturalWidth) {
            setOrientation("portrait");
          } else {
            setOrientation("square");
          }
        }}
      />
    </div>
  );
}

export default PostImage;
