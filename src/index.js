import React from "react";
import ReactDOM from "react-dom/client"
import {RouterProvider} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'

// app
import Routes from "./routes"

const root = document.querySelector("#root")
ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RouterProvider router={Routes} />
    </React.StrictMode>
);