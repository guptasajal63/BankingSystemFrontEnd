import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/authSlice";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    MenuItem,
    Snackbar,
    Grid,
    CircularProgress,
    Link,
    InputAdornment,
    IconButton,
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
    const form = useRef();

    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    // const [role, setRole] = useState("customer"); // Removed and defaulted to customer
    const [successful, setSuccessful] = useState(false);
    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Validation State
    const [errors, setErrors] = useState({});

    const { message } = useSelector((state) => state.message);
    const dispatch = useDispatch();

    const validate = () => {
        let tempErrors = {};
        if (username.length < 3) tempErrors.username = "Username must be at least 3 characters.";
        if (username.length > 20) tempErrors.username = "Username too long (max 20).";

        if (!fullName) tempErrors.fullName = "Full Name is required.";

        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) tempErrors.email = "Invalid email address.";

        if (password.length < 6) tempErrors.password = "Password must be at least 6 characters.";
        if (password.length > 40) tempErrors.password = "Password too long (max 40).";

        if (!phoneNumber) tempErrors.phoneNumber = "Phone number is required.";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setSuccessful(false);

        if (validate()) {
            setLoading(true);
            dispatch(register({ username, fullName, email, password, phoneNumber, role: ["customer"] }))
                .unwrap()
                .then(() => {
                    setSuccessful(true);
                    setLoading(false);
                    setSnackbarMessage("Registration Successful! You can now login.");
                    setOpenSnackbar(true);
                    setErrors({});
                })
                .catch((error) => {
                    setSuccessful(false);
                    setLoading(false);

                    // Simple parsing of backend validation error if it comes as a string
                    if (typeof error === 'string' && error.includes("size must be between")) {
                        setSnackbarMessage("Registration failed: Please check inputs (Password min 6, Username min 3).");
                        // You could parse strictly here, but client-side validation should cover it now.
                    } else {
                        setSnackbarMessage("Registration Failed: " + (message || "Unknown error"));
                    }
                    setOpenSnackbar(true);
                });
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex", // Centering logic
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                padding: 2,
            }}
        >
            <Container component="main" maxWidth="md">
                <Paper
                    elevation={6}
                    sx={{
                        display: "flex",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
                    }}
                >
                    {/* Left Side - Image/Branding (Hidden on small screens) */}
                    <Box
                        sx={{
                            flex: 1,
                            backgroundColor: "primary.main",
                            color: "white",
                            display: { xs: "none", md: "flex" },
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 4,
                            textAlign: 'center'
                        }}
                    >
                        <PersonAddIcon sx={{ fontSize: 80, mb: 2 }} />
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            Join Us
                        </Typography>
                        <Typography variant="body1">
                            Create your secure banking account today and experience next-gen financial services.
                        </Typography>
                    </Box>

                    {/* Right Side - Form */}
                    <Box
                        sx={{
                            flex: 1.2,
                            padding: 6,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, mb: 2, color: 'primary.main' }}>
                            <PersonAddIcon sx={{ fontSize: 40 }} />
                        </Box>

                        <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
                            Create Account
                        </Typography>

                        <Box component="form" onSubmit={handleRegister} ref={form} noValidate sx={{ width: '100%' }}>
                            {!successful ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="fullName"
                                            label="Full Name"
                                            name="fullName"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            error={!!errors.fullName}
                                            helperText={errors.fullName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="username"
                                            label="Username"
                                            name="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            error={!!errors.username}
                                            helperText={errors.username || "Min 3 characters"}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="phoneNumber"
                                            label="Phone Number"
                                            name="phoneNumber"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            error={!!errors.password}
                                            helperText={errors.password || "Min 6 characters"}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    {/* Role selection removed - default to customer */}
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            sx={{ mt: 1, mb: 2, textTransform: 'none', borderRadius: 2 }}
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Alert severity="success" sx={{ mb: 2 }}>
                                        Registration Successful!
                                    </Alert>
                                    <Button variant="outlined" href="/login" fullWidth>
                                        Proceed to Login
                                    </Button>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Link href="/login" variant="body2" sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 600 }}>
                                    Already have an account? Sign In
                                </Link>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Container>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={successful ? "success" : "error"} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Register;
