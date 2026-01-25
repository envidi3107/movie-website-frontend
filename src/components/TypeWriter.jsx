import React, { useEffect, useRef } from "react";

export default function TypeWriter({ content, typeSpeed }) {
  const textContainer = useRef(null);
  console.log("content:", content);

  useEffect(() => {
    if (!content) return;

    let index = 0;
    const typeEffect = () => {
      if (!textContainer.current) return;

      textContainer.current.innerHTML =
        content.slice(0, index) +
        `<span class='inline-block w-[3px] h-[48px] bg-blue-600 ml-[4px] transform translate-y-[3px] animate-cursor'></span>`;
      index++;
      if (index <= content.length) {
        setTimeout(typeEffect, typeSpeed);
      }
    };
    typeEffect();
  }, [content, typeSpeed]);

  return (
    <div className="relative mb-[10px]">
      <p
        className="specialColor max-w-[70%] h-auto relative font-bold text-5xl"
        ref={textContainer}
      ></p>
    </div>
  );
}
