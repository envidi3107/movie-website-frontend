import React from "react";
import styles from "./PulseAnimation.module.css";

export default function PulseAnimation({ onLoading }) {
  return (
    <div
      className="loading-animation text-[200%] absolute top-0 right-0 bottom-0 left-0 rounded-[10px] box-border text-white border-[2px] border-solid border-red-500 bg-black bg-opacity-70 items-center justify-center"
      style={onLoading ? { display: "flex" } : { display: "none" }}
    >
      <div
        className={
          styles.waveAnimationItem_1 +
          " " +
          styles.waveAnimationItem +
          " w-[7px] h-[16px] bg-slate-500 mx-[2px] rounded-[3px]"
        }
      ></div>
      <div
        className={
          styles.waveAnimationItem_2 +
          " " +
          styles.waveAnimationItem +
          " w-[7px] h-[16px] bg-slate-500 mx-[2px] rounded-[3px]"
        }
      ></div>
      <div
        className={
          styles.waveAnimationItem_3 +
          " " +
          styles.waveAnimationItem +
          " w-[7px] h-[16px] bg-slate-500 mx-[2px] rounded-[3px]"
        }
      ></div>
    </div>
  );
}
