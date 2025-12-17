import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#9e2a2b", // Deep Burgundy (IDFC style)
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#333333", // Dark Grey
        },
        background: {
            default: "#f4f6f8",
            paper: "#ffffff",
        },
        text: {
            primary: "#2d2d2d",
            secondary: "#555555",
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            color: "#333",
        },
        h5: {
            fontWeight: 600,
            color: "#9e2a2b",
        },
        button: {
            textTransform: "none", // More modern look
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "10px 20px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                            borderColor: "#e0e0e0",
                        },
                        "&:hover fieldset": {
                            borderColor: "#9e2a2b",
                        },
                    },
                },
            },
        },
    },
});

export default theme;
