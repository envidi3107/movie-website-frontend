import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";

const aspectRatios = {
  backdrop: [
    { label: "Original", value: null },
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
    { label: "3:2", value: 3 / 2 },
  ],
  poster: [
    { label: "Original", value: null },
    { label: "2:3", value: 2 / 3 },
    { label: "3:4", value: 3 / 4 },
    { label: "9:16", value: 9 / 16 },
  ],
};

export default function CropModal({ cropModal, onCancel, onComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(cropModal.originalAspect);
  const onCropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  if (
    typeof window === "undefined" ||
    typeof document === "undefined" ||
    !document.body
  ) {
    return null;
  }

  return ReactDOM.createPortal(
    <div
      key={cropModal.image}
      className="fixed top-0 right-0 left-0 bottom-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-70 p-[10px]"
    >
      <div className="bg-[#2D2D2D] p-[10px] rounded-lg max-w-4xl w-full h-full flex flex-col overflow-y-auto">
        <h2 className="text-white text-xl mb-4">Crop {cropModal.type}</h2>

        {/* Aspect ratio selection */}
        <div className="flex gap-2 mb-4">
          {aspectRatios[cropModal.type].map((ratio) => (
            <button
              key={ratio.label}
              onClick={() =>
                setAspect(
                  ratio.label === "Original"
                    ? cropModal.originalAspect
                    : ratio.value,
                )
              }
              className={`px-3 py-1 rounded ${
                (ratio.label === "Original" &&
                  aspect === cropModal.originalAspect) ||
                ratio.value === aspect
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-gray-300"
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>

        {/* Cropper container with fixed height */}
        <div className="relative w-full min-h-[300px] max-h-[500px]">
          <Cropper
            image={cropModal.image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            classes={{ containerClassName: "cropper-container" }}
          />
        </div>

        {/* Zoom controls */}
        <div className="mt-4 cursor-grabbing">
          <label className="text-white block mb-2">Zoom</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={() => onCancel({ open: false, type: null, image: null })}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onComplete(croppedAreaPixels)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Crop
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
