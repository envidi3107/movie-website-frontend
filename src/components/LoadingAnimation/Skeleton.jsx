import React from "react";

function Skeleton({ className }) {
  return (
    <div
      className={"overflow-hidden relative bg-gray-700 rounded " + className}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-shimmer bg-[length:200%_100%]"></div>
    </div>
  );
}

export default Skeleton;
