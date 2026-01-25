import React from "react";
import { useState } from "react";
import MoveToRightAnimation from "../../LoadingAnimation/MoveToRightAnimation/MoveToRightAnimation";
import SpinAnimation from "../../LoadingAnimation/SpinAnimation/SpinAnimation";
import styles from "./Video.module.css";

//https://img.youtube.com/vi/FTCOCpdFaS0/default.jpg

function Video({ key, videoData, onFormatDate }) {
  const [isError, setError] = useState(false);
  const [isLoadingIframe, setLoadingIframe] = useState(true);
  const [isLoadingImage, setLoadingImage] = useState(true);
  const [isPlaying, setPlaying] = useState(false);
  if (isError) return null;

  return (
    <div
      key={key}
      className="w-full h-[100px] rounded-[10px] border border-[1px] border-solid border-black flex p-[5px]"
    >
      <div className="w-[50%] h-full bg-slate-500 rounded-[10px] mr-[5px] relative">
        {isPlaying ? (
          <iframe
            loading="lazy"
            onLoad={() => setLoadingIframe(false)}
            onError={() => setError(true)}
            className="w-[70%] h-full rounded-[8px]"
            src={`https://www.youtube.com/embed/${videoData.movieVideos === null ? "" : videoData.movieVideos[0].key}?si=cDLDTXRavMIN83RE`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        ) : (
          <div
            className="relative bg-slate-600"
            onClick={() => setPlaying(true)}
          >
            <MoveToRightAnimation />
            <img
              onLoad={() => setLoadingImage(false)}
              src={`https://img.youtube.com/vi/${videoData.key}/default.jpg`}
              alt=""
              className="w-full h-full"
            />
            <div
              className={styles.playIcon + " absolute top-[50%] left-[50%]"}
            ></div>
          </div>
        )}
      </div>
      <div className="w-[50%] text-white overflow-hidden">
        <p className="">{videoData.name}</p>
        <p className="text-[grey]">{onFormatDate(videoData.published_at)}</p>
      </div>
    </div>
  );
}

export default Video;
