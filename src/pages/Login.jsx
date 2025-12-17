import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Snackbar,
    Alert,
    CircularProgress,
    Link,
} from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const Login = () => {
    let navigate = useNavigate();
    const form = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [errors, setErrors] = useState({});

    const { isLoggedIn } = useSelector((state) => state.auth);
    const { message } = useSelector((state) => state.message);

    const dispatch = useDispatch();

    const validate = () => {
        let tempErrors = {};
        if (!username) tempErrors.username = "Username is required";
        if (!password) tempErrors.password = "Password is required";
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleLogin = (e) => {
        e.preventDefault();

        if (validate()) {
            setLoading(true);
            dispatch(login({ username, password }))
                .unwrap()
                .then(() => {
                    setSnackbarMessage("Login Successful! Redirecting...");
                    setOpenSnackbar(true);
                    setTimeout(() => {
                        navigate("/profile");
                        window.location.reload();
                    }, 1500);
                })
                .catch(() => {
                    setLoading(false);
                    setSnackbarMessage("Invalid username or password");
                    setOpenSnackbar(true);
                });
        }
    };

    if (isLoggedIn) {
        return <Navigate to="/profile" />;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                padding: 2,
            }}
        >
            <Container component="main" maxWidth="sm">
                <Paper
                    elevation={6}
                    sx={{
                        padding: 6,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderRadius: 3,
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                    }}
                >
                    <AccountBalanceIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
                    <Typography component="h1" variant="h4" sx={{ mb: 1, fontWeight: 'bold', color: '#1a1a1a' }}>
                        Welcome Back
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Secure Internet Banking Login
                    </Typography>

                    <Box component="form" onSubmit={handleLogin} ref={form} noValidate sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            error={!!errors.username}
                            helperText={errors.username}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={{ mb: 3 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 1,
                                mb: 2,
                                py: 1.5,
                                fontSize: '1.1rem',
                                textTransform: 'none',
                                borderRadius: 2
                            }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
                        </Button>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Link href="/register" variant="body2" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 600 }}>
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={openSnackbar || !!message}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={isLoggedIn && loading ? "success" : "error"} sx={{ width: '100%' }}>
                    {snackbarMessage || message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Login;
