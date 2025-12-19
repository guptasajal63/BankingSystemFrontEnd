import React from 'react';
import { Container, Typography, Box, Grid, Paper, Avatar } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const About = () => {
    return (
        <Box sx={{ flexGrow: 1, py: 8, backgroundColor: '#f5f7fa' }}>
            <Container maxWidth="lg">
                <Box mb={6} textAlign="center">
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
                        Revolutionizing Your Banking Experience
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
                        We are dedicated to providing a secure, transparent, and seamless digital banking platform that empowers you to control your financial future.
                    </Typography>
                </Box>

                <Grid container spacing={4} sx={{ mb: 8 }}>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 4, height: '100%', textAlign: 'center', borderRadius: 2 }}>
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                                <SecurityIcon fontSize="large" />
                            </Avatar>
                            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                                Unmatched Security
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Your peace of mind is our priority. We employ state-of-the-art encryption and multi-factor authentication to safeguard your assets and data.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 4, height: '100%', textAlign: 'center', borderRadius: 2 }}>
                            <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                                <SpeedIcon fontSize="large" />
                            </Avatar>
                            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                                Lightning Fast
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Experience instant transfers and real-time updates. Our modern infrastructure ensures your transactions happen as fast as life does.
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ p: 4, height: '100%', textAlign: 'center', borderRadius: 2 }}>
                            <Avatar sx={{ bgcolor: 'info.main', width: 60, height: 60, mx: 'auto', mb: 2 }}>
                                <TrendingUpIcon fontSize="large" />
                            </Avatar>
                            <Typography variant="h5" component="h3" gutterBottom fontWeight="bold">
                                Growth Focused
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                We provide the tools you need to grow your wealth. From insightful analytics to smart savings features, we are your partner in financial success.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>

                <Box>
                    <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" textAlign="center">
                        Our Mission
                    </Typography>
                    <Typography variant="body1" paragraph align="justify" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        Established with a vision to simplify banking for the digital age, Online Banking System bridges the gap between traditional reliability and modern convenience. We believe banking should be accessible, transparent, and user-centric. Whether you are managing personal finances or running a business, our platform is designed to adapt to your needs, providing 24/7 access to your funds without the hassle of physical branches.
                    </Typography>
                    <Typography variant="body1" paragraph align="justify" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        Join thousands of satisfied customers who have made the switch to smarter banking. At Online Banking System, we aren't just a bank; we are your financial partner, committed to helping you achieve your goals with innovation and integrity.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default About;
