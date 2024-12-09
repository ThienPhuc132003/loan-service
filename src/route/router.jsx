import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// Định nghĩa router
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: React.createElement(App),
    },
    // Các routes khác
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

export default router;