import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {
    Container, Typography, Box, Grid, Avatar, Button, Divider,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert,
    Card, CardContent, IconButton, Stack, Chip
} from "@mui/material";

// Icons
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import AlternateEmailRoundedIcon from '@mui/icons-material/AlternateEmailRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import FingerprintRoundedIcon from '@mui/icons-material/FingerprintRounded';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';

import UserService from "../services/user.service";
import { updateUser } from "../store/authSlice";

const Profile = () => {
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState({
        fullName: "",
        email: "",
        phoneNumber: ""
    });
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    const handleClickOpen = () => {
        setEditData({
            fullName: currentUser.fullName || "",
            email: currentUser.email || "",
            phoneNumber: currentUser.phoneNumber || ""
        });
        setOpen(true);
        setMessage("");
        setSuccessful(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleUpdateProfile = () => {
        setMessage("");
        setSuccessful(false);

        UserService.updateProfile(editData.fullName, editData.email, editData.phoneNumber).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                dispatch(updateUser({
                    fullName: editData.fullName,
                    email: editData.email,
                    phoneNumber: editData.phoneNumber
                }));
                setTimeout(() => handleClose(), 1500);
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    const stringToColor = (string) => {
        let hash = 0;
        for (let i = 0; i < string.length; i += 1) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
        }
        let color = '#';
        for (let i = 0; i < 3; i += 1) {
            const value = (hash >> (i * 8)) & 0xff;
            color += `00${value.toString(16)}`.slice(-2);
        }
        return color;
    };

    const getInitials = (name) => (name ? name.charAt(0).toUpperCase() : "U");

    // Reusable Info Item Component
    const InfoItem = ({ icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#f8fafd', borderRadius: 4 }}>
            <Box sx={{
                mr: 2,
                p: 1.5,
                borderRadius: '50%',
                bgcolor: 'white',
                color: 'primary.main',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                display: 'flex'
            }}>
                {icon}
            </Box>
            <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ letterSpacing: 1, textTransform: 'uppercase' }}>
                    {label}
                </Typography>
                <Typography variant="body1" fontWeight="600" color="#2c3e50" noWrap>
                    {value}
                </Typography>
            </Box>
        </Box>
    );

    // Helper to determine the ID Label based on role
    const getIdLabel = () => {
        if (currentUser.roles.includes("ROLE_ADMIN")) return "Admin ID";
        if (currentUser.roles.includes("ROLE_BANKER")) return "Banker ID";
        return "Customer ID";
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#eff3f8", py: 5 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    {/* Header Section */}
                    <Grid item xs={12} sx={{ mb: 2 }}>
                        <Typography variant="h3" fontWeight="800" color="#1a237e" gutterBottom>
                            Hello, {currentUser.fullName ? currentUser.fullName.split(' ')[0] : currentUser.username} 👋
                        </Typography>
                        <Typography variant="h6" color="text.secondary">
                            Here is your profile configuration and preferences.
                        </Typography>
                    </Grid>

                    {/* Left Column: Identity Card */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{
                            borderRadius: 6,
                            textAlign: 'center',
                            p: 4,
                            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                            background: 'white',
                            height: '100%',
                            position: 'relative',
                            overflow: 'visible'
                        }}>
                            <Box sx={{
                                position: 'relative',
                                display: 'inline-block',
                                mb: 3
                            }}>
                                <Avatar
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        bgcolor: stringToColor(currentUser.username),
                                        fontSize: '3.5rem',
                                        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
                                        border: '6px solid white'
                                    }}
                                >
                                    {getInitials(currentUser.fullName || currentUser.username)}
                                </Avatar>
                            </Box>

                            <Typography variant="h5" fontWeight="800" gutterBottom color="#2c3e50">
                                {currentUser.fullName || currentUser.username}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                                {currentUser.roles && currentUser.roles.map((role, index) => (
                                    <Chip
                                        key={index}
                                        label={role.replace("ROLE_", "")}
                                        color="primary"
                                        size="small"
                                        sx={{ borderRadius: 2, fontWeight: 'bold' }}
                                    />
                                ))}
                            </Box>

                            <Divider sx={{ mb: 3 }} />

                            <Button
                                variant="contained"
                                startIcon={<EditRoundedIcon />}
                                fullWidth
                                onClick={handleClickOpen}
                                sx={{
                                    borderRadius: 4,
                                    py: 1.5,
                                    boxShadow: '0 8px 20px rgba(25, 118, 210, 0.3)',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    fontSize: '1rem'
                                }}
                            >
                                Edit Profile details
                            </Button>
                        </Card>
                    </Grid>

                    {/* Right Column: Info Widget Grid */}
                    <Grid item xs={12} md={8}>
                        <Stack spacing={4}>
                            <Card sx={{
                                borderRadius: 6,
                                p: 4,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                background: 'white'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                                    <FingerprintRoundedIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                                    <Typography variant="h5" fontWeight="800" color="#2c3e50">
                                        Account Information
                                    </Typography>
                                </Box>

                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem
                                            icon={<AlternateEmailRoundedIcon />}
                                            label="Username"
                                            value={currentUser.username}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem
                                            icon={<BadgeRoundedIcon />}
                                            label={getIdLabel()}
                                            value={`#${currentUser.id}`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem
                                            icon={<EmailRoundedIcon />}
                                            label="Email Address"
                                            value={currentUser.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem
                                            icon={<LocalPhoneRoundedIcon />}
                                            label="Phone Number"
                                            value={currentUser.phoneNumber || "Not Set"}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <InfoItem
                                            icon={<VerifiedUserRoundedIcon />}
                                            label="Status"
                                            value="Active Verified Account"
                                        />
                                    </Grid>
                                </Grid>
                            </Card>

                            {/* Help & Support Section
                            <Card sx={{
                                borderRadius: 6,
                                p: 4,
                                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                background: 'white'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                                    <Typography variant="h5" fontWeight="800" color="#2c3e50">
                                        Help & Support
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Need assistance with your account? Our support team is available 24/7.
                                </Typography>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => alert("Call Support functionality coming soon!")}
                                        sx={{ borderRadius: 3, py: 1.5, flex: 1, textTransform: 'none', fontWeight: 'bold' }}
                                    >
                                        Call Support
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => alert("Email Support functionality coming soon!")}
                                        sx={{ borderRadius: 3, py: 1.5, flex: 1, textTransform: 'none', fontWeight: 'bold' }}
                                    >
                                        Email Us
                                    </Button>
                                </Stack>
                            </Card> */}
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            {/* Edit Dialog */}
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
            >
                <DialogTitle sx={{ fontWeight: '800', fontSize: '1.5rem', color: '#1a237e' }}>Update Your Profile</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Update your personal details here. Changes will be reflected immediately.
                    </Typography>
                    {message && (
                        <Alert severity={successful ? "success" : "error"} sx={{ mb: 3, borderRadius: 2 }}>
                            {message}
                        </Alert>
                    )}
                    <Stack spacing={3}>
                        <TextField
                            label="Full Name"
                            name="fullName"
                            fullWidth
                            variant="outlined"
                            value={editData.fullName}
                            onChange={handleChange}
                            InputProps={{ sx: { borderRadius: 3 } }}
                        />
                        <TextField
                            label="Email Address"
                            name="email"
                            fullWidth
                            variant="outlined"
                            value={editData.email}
                            onChange={handleChange}
                            InputProps={{ sx: { borderRadius: 3 } }}
                        />
                        <TextField
                            label="Phone Number"
                            name="phoneNumber"
                            fullWidth
                            variant="outlined"
                            value={editData.phoneNumber}
                            onChange={handleChange}
                            InputProps={{ sx: { borderRadius: 3 } }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Cancel</Button>
                    <Button
                        onClick={handleUpdateProfile}
                        variant="contained"
                        size="large"
                        sx={{ borderRadius: 3, px: 4, boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)' }}
                    >
                        Save Updates
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Profile;
