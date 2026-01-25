import React, { useEffect, useState } from "react";

function TextOverflow({ content, useBy }) {
  const [showText, setShowText] = useState(false);

  if (content === undefined || content === null)
    return (
      <div className="w-full h-full flex justify-center items-center">
        no content
      </div>
    );

  let splittedParagraph = content.split(/\s+/);
  let endIndex = Math.min(15, splittedParagraph.length);
  return (
    <div
      className={
        "h-auto text-[92%]" +
        (!showText ? " overflow-hidden" : "") +
        (!showText
          ? "w-auto"
          : useBy === "MovieDetail"
            ? "w-full"
            : " w-[500px]")
      }
    >
      {splittedParagraph
        .slice(0, !showText ? endIndex : splittedParagraph.length)
        .join(" ") + " "}
      <span
        onClick={() => setShowText(!showText)}
        className="text-yellow-300 cursor-pointer hover:underline"
      >
        {!showText ? "see more..." : "see less."}
      </span>
    </div>
  );
}

export default TextOverflow;
