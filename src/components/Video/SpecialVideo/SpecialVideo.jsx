import React from "react";
import { useState } from "react";
import SpinAnimation from "../../LoadingAnimation/SpinAnimation/SpinAnimation";

//https://img.youtube.com/vi/FTCOCpdFaS0/default.jpg

function SpecialVideo({ movieData }) {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  if (isError)
    return (
      <div className="w-full h-[350px] mx-auto py-[10px] bg-black flex justify-center text-red-500">
        <p>Sorry! Video doesn't exist</p>
      </div>
    );

  return (
    <div className="w-full h-[350px] mx-auto py-[10px] bg-black flex justify-center relative">
      {isLoading ? (
        <SpinAnimation
          onLoading={isLoading}
          style={{
            width: "30px",
            height: "30px",
            border: "5px solid white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ) : (
        ""
      )}
      <iframe
        loading="lazy"
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        className="w-[70%] h-full rounded-[8px]"
        src={`https://www.youtube.com/embed/${movieData.movieVideos === null ? "" : movieData.movieVideos[0].key}?si=cDLDTXRavMIN83RE`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default SpecialVideo;
