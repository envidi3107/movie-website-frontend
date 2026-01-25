import React, { createContext, useContext, useState } from "react";

export const PageTransitionContext = createContext({
  pageNumber: 1,
  setPageNumber: () => {},
  nextPage: () => {},
  previousPage: () => {},
});

export function PageTransitionProvider({ children }) {
  const [pageNumber, setPageNumber] = useState(1);
  const nextPage = () => {
    setPageNumber((prev) => prev + 1);
  };
  const previousPage = (pageNumber) => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  };

  return (
    <PageTransitionContext.Provider
      value={{ pageNumber, setPageNumber, nextPage, previousPage }}
    >
      {children}
    </PageTransitionContext.Provider>
  );
}

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);

  if (!context) {
    throw new Error("Page transition context must be used in component");
  }

  return context;
};
