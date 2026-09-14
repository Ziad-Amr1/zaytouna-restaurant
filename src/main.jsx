import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import AuthProvider from "@/context/AuthProvider";
import CartProvider from "@/context/CartProvider";
import AppToaster from "@/components/ui/toaster";
import { DirectionProvider } from "@/i18n/DirectionProvider";
import "./i18n";
import "./zaytouna-tokens.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <CartProvider>
          <DirectionProvider>
            <App />
            <AppToaster />
          </DirectionProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);