import { useState } from "react";

function PostImage({ src }) {
  const [orientation, setOrientation] = useState(null);

  function handleLoad(e) {
    const { naturalWidth, naturalHeight } = e.target;

    if (naturalWidth > naturalHeight) {
      setOrientation("landscape");
    } else {
      setOrientation("portrait");
    }
  }

  return (
    <div className={`post-image-container ${orientation}`}>
      <img src={src} onLoad={handleLoad} alt="post" />
    </div>
  );
}

export default PostImage;