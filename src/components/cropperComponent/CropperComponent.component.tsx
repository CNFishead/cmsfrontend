import { useEffect, useRef } from "react";
import Cropper from "cropperjs";
import { Blob } from "buffer";

type Props = {
  imageSrc?: string;
  onCrop: (blob: Blob) => void;
};

const CropperComponent = ({ imageSrc, onCrop }: Props) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cropperRef = useRef<Cropper>();

  useEffect(() => {
    const image = imageRef.current;
    const container = containerRef.current;

    if (!image || !container) {
      return;
    }

    const cropper = new Cropper(image, {
      // aspectRatio: 16/9
      aspectRatio: 16 / 9,
      viewMode: 1,
      checkCrossOrigin: false, // add this option
    });
    const cropBoxData = cropper.getCropBoxData();
    const cropBoxElement = document.createElement("div");
    cropBoxElement.style.width = `${cropBoxData.width}px`;
    cropBoxElement.style.height = `${cropBoxData.height}px`;
    cropBoxElement.style.left = `${cropBoxData.left}px`;
    cropBoxElement.style.top = `${cropBoxData.top}px`;
    cropBoxElement.style.position = "absolute";
    container.appendChild(cropBoxElement);
    cropperRef.current = cropper;

    return () => {
      cropper.destroy();
      cropperRef.current = undefined;
    };
  }, [imageSrc]);

  const handleCrop = async () => {
    const cropper = cropperRef.current;
    if (!cropper) {
      return;
    }
    // grab the cropped image and pass it as a blob data to the onCrop function
    const canvas = cropper.getCroppedCanvas();

    canvas.toBlob(async (blob) => {
      if (!blob) {
        return;
      }
      onCrop(
        (await fetch(canvas.toDataURL()).then((res) => {
          return res.blob();
        })) as Blob
      );
    });
  };

  return (
    <div ref={containerRef}>
      <img ref={imageRef} src={imageSrc} alt="" style={{ width: "100%", height: "100%" }} />
      <button onClick={handleCrop}>Crop</button>
    </div>
  );
};

export default CropperComponent;
