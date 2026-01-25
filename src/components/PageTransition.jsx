import React from "react";
import { usePageTransition } from "../context/PageTransitionContext";

function PageTransition() {
  const { pageNumber, setPageNumber, nextPage, previousPage } =
    usePageTransition();

  return (
    <div className="page-transition w-full h-[30px] flex justify-center">
      <button
        title="Previous Page"
        className="w-[30px] bg-orange-500 hover:bg-orange-700 "
        onClick={() => previousPage(pageNumber)}
      >
        {"<<"}
      </button>
      <p className="w-[30px] text-center text-white">{pageNumber}</p>
      <button
        title="Next Page"
        className="w-[30px] bg-orange-500 hover:bg-orange-700 "
        onClick={() => nextPage(pageNumber)}
      >
        {">>"}
      </button>
    </div>
  );
}

export default PageTransition;
