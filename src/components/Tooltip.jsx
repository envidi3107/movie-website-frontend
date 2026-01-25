import React, { useState } from "react";

const Tooltip = ({ children, text, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2";
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2";
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2";
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2";
      default:
        return "top-full left-1/2 -translate-x-1/2 mt-2";
    }
  };

  return (
    <div
      className="relative flex justify-center items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {visible && (
        <div
          className={`absolute z-50 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg transition-opacity truncate duration-200 ease-in-out opacity-100 ${getPositionClasses()}`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
