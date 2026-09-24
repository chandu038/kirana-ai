import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css";
import App from "./App.jsx";

const googleId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const app = (
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {googleId ? <GoogleOAuthProvider clientId={googleId}>{app}</GoogleOAuthProvider> : app}
  </StrictMode>
);