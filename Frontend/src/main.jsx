import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#182130",
            color: "#f4eee4",
            border: "1px solid rgba(217, 173, 98, 0.25)",
            borderRadius: "14px",
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);