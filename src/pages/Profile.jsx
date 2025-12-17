import React from "react";
import { Navigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Container, Typography, Paper, Box, Grid, Avatar, Divider } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Profile = () => {
    const { user: currentUser } = useSelector((state) => state.auth);

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "#f4f6f8",
                py: 4
            }}
        >
            <Container maxWidth="md">
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        background: "white"
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mr: 3 }}>
                            <AccountCircleIcon sx={{ fontSize: 50 }} />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold" color="text.primary">
                                {currentUser.username}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                {currentUser.email}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Typography variant="h6" gutterBottom color="primary.main" fontWeight="600">
                        Account Details
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">User ID</Typography>
                                <Typography variant="body1" fontWeight="500">{currentUser.id}</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Account Status</Typography>
                                <Typography variant="body1" fontWeight="500" color="success.main">Active</Typography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f9fafb', borderRadius: 2 }}>
                                <Typography variant="caption" color="text.secondary">Assigned Roles</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    {currentUser.roles && currentUser.roles.map((role, index) => (
                                        <Box key={index} sx={{
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText',
                                            px: 2, py: 0.5, borderRadius: 10, fontSize: '0.875rem'
                                        }}>
                                            {role}
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                                    Security Token (Session Debug)
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-all', fontFamily: 'monospace', bgcolor: '#eee', p: 1, borderRadius: 1 }}>
                                    {currentUser.token.substring(0, 20)}...{currentUser.token.substr(currentUser.token.length - 20)}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
};

export default Profile;
