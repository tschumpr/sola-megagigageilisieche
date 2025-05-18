import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "rgb(51, 243, 51)",
      contrastText: "rgb(0, 0, 0)",
    },
    secondary: {
      main: "rgb(245, 0, 87)",
      contrastText: "rgb(255, 255, 255)",
    },
    error: {
      main: "rgb(255, 38, 43)",
    },
    warning: {
      main: "rgb(255, 137, 46)",
    },
    success: {
      main: "rgb(0, 218, 9)",
    },
    info: {
      main: "rgb(0, 165, 255)",
    },
  },
});
