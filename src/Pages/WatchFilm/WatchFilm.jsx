import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import SpinAnimation from "../../components/LoadingAnimation/SpinAnimation/SpinAnimation";
import Image from "../../components/Image/Image";
import styles from "./WatchFilm.module.css";
import YouTube from "react-youtube";

function WatchFilm() {
  const [loading, setLoading] = useState(true);
  const { videoKey } = useParams();
  const playerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  let intervalIdsList =
    JSON.parse(localStorage.getItem("intervalIdsList")) || [];
  let movieVideos = JSON.parse(localStorage.getItem("movieVideos")) || [];
  let savedTimeList = JSON.parse(localStorage.getItem("savedTimeList")) || {};
  useEffect(() => {
    intervalIdsList.forEach((id) => clearInterval(id));
    intervalIdsList = [];
    localStorage.setItem("intervalIdsList", JSON.stringify(intervalIdsList));
  }, [location]);

  return (
    <div className="text-white w-screen h-screen relative overflow-x-hidden p-[5px]">
      <YouTube
        videoId={videoKey}
        style={{
          height: "100%",
          width: "100%",
        }}
        opts={{
          height: "100%",
          width: "100%",
          playerVars: {
            autoplay: 1,
            vq: "hd1080",
            start: savedTimeList[videoKey] + 1 || 0,
          },
        }}
        onReady={(e) => {
          playerRef.current = e.target;
          let intervalId = setInterval(() => {
            savedTimeList[videoKey] = playerRef.current.getCurrentTime();
            localStorage.setItem(
              "savedTimeList",
              JSON.stringify(savedTimeList),
            );
          }, 1000);
          intervalIdsList.push(intervalId);
          localStorage.setItem(
            "intervalIdsList",
            JSON.stringify(intervalIdsList),
          );
          setLoading(false);
        }}
      />
      <div className="text-white my-[5px] flex">
        <p className="">1000,000 view</p>
        <div className="w-[2px] rounded-[10px] min-h-full bg-white mx-[10px]"></div>
        <p className="text-[red]">200 like</p>
        <div className="w-[2px] rounded-[10px] min-h-full bg-white mx-[10px]"></div>
        <p className="text-[green]">20 dislike</p>
      </div>
      <div
        className={`${
          loading ? "" : "hidden"
        } absolute top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center border-[1px] border-solid border-red-700 rounded-[10px]`}
      >
        <SpinAnimation onLoading={loading} />
      </div>

      <div className="my-[10px]">
        <h1 className="text-white text-2xl font-bold">Related trailers</h1>
      </div>

      <div
        className={
          styles.relatedTrailerBox +
          " flex gap-x-[10px] overflow-x-scroll overflow-y-hidden"
        }
        onWheel={(e) => (e.currentTarget.scrollLeft += e.deltaY)}
      >
        {movieVideos.map((video) => (
          <div
            title={video.key}
            key={video.id}
            style={
              video.key === videoKey
                ? { display: "none" }
                : { display: "block" }
            }
            className="min-w-[170px] aspect-[4/3] relative border-[1px] border-solid border-[grey] rounded-[8px] flex flex-wrap hover:transform hover:scale-[1.03] transition-all duration-200 ease-linear cursor-pointer"
            onClick={() => navigate(`/watch/${video.key}`)}
          >
            <Image
              src={`https://img.youtube.com/vi/${video.key}/default.jpg`}
            />
            <div
              className={
                styles.playIcon +
                " absolute top-[50%] left-[50%] hover:bg-slate-300"
              }
            ></div>
          </div>
        ))}
      </div>
      <Link to="/home">Back home</Link>
    </div>
  );
}

export default WatchFilm;
