import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import App from "./App";
import setupInterceptors from "./services/setupInterceptors";
import { createTheme, ThemeProvider } from '@mui/material/styles';

setupInterceptors(store);
import CssBaseline from '@mui/material/CssBaseline';

import theme from "./theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);
