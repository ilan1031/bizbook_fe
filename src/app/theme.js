import { Margin } from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#187C19",
      navbar: "#779B2A",
    },
    custom: {
      greenGradient:
        "linear-gradient(90deg, #779B2A 0%, #9AC757 53%, #C4ED53 100%)",
    },
    secondary: {
      main: "#21263c",
    },
    background: {
      default: "#F5F5F5",
    },
    text: {
      primary: "#1E293B",
    },
    menu: {
      active: "#E9E9E9",
      hover: "#F5F5F5",
      text: {
        active: "#187C19",
        normal: "white",
        disabled: "black",
        default: "#333",
      },
      collapse: {
        background: "#187C19",
        active: "#187C19",
      },
    },
    // ✅ Add a common hover setting
    hover: {
      background: "#187C19",
      text: "white",
      borderRadius: "5px",
      Margin: "10px",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "uppercase",
        },
      },
    },
  },
});

export default theme;
