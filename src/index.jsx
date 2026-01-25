import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import { AuthUserProvider } from "./context/AuthUserContext.jsx";
import { PageTransitionProvider } from "./context/PageTransitionContext.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <NotificationProvider>
      <AuthUserProvider>
        <PageTransitionProvider>
          <App />
        </PageTransitionProvider>
      </AuthUserProvider>
    </NotificationProvider>
  </BrowserRouter>,
);

reportWebVitals();
