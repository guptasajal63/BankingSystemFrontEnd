import React from 'react';
import { Box, Container, Typography, Link, Grid, IconButton, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 8,
                px: 2,
                mt: 'auto',
                background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)', // Deep blue gradient
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Decorative Circle */}
            <Box sx={{
                position: 'absolute',
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Grid container spacing={5}>
                    {/* Brand Section */}
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" color="inherit" gutterBottom fontWeight="800" sx={{ letterSpacing: 1 }}>
                            OBS BANKING
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.8, maxWidth: 300 }}>
                            Empowering your financial journey with secure, instant, and next-generation banking solutions. Join millions of users today.
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {[<FacebookIcon />, <TwitterIcon />, <InstagramIcon />, <LinkedInIcon />].map((icon, index) => (
                                <IconButton
                                    key={index}
                                    sx={{
                                        color: 'white',
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '&:hover': { bgcolor: '#ff5722', transform: 'translateY(-3px)' },
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {icon}
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Quick Links */}
                    <Grid item xs={12} sm={6} md={2}>
                        <Typography variant="subtitle1" color="inherit" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                            Quick Access
                        </Typography>
                        <Stack spacing={1.5}>
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About Us', path: '/about' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    component={RouterLink}
                                    to={item.path}
                                    color="inherit"
                                    underline="none"
                                    sx={{
                                        opacity: 0.7,
                                        '&:hover': { opacity: 1, color: '#ff9800', pl: 1 },
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* Contact Info */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" color="inherit" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                            Our Support
                        </Typography>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                                <Typography variant="body2">📧 support@obs-bank.com</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                                <Typography variant="body2">📞 +91 9876543210</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', opacity: 0.8 }}>
                                <Typography variant="body2">📍 Pune, Maharashtra</Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Legal Links */}
                    <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="subtitle1" color="inherit" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                            Legal
                        </Typography>
                        <Stack spacing={1.5}>
                            {['Privacy Policy', 'Terms of Service'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    color="inherit"
                                    underline="none"
                                    sx={{
                                        opacity: 0.7,
                                        fontSize: '0.875rem',
                                        '&:hover': { opacity: 1, textDecoration: 'underline' }
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>
                </Grid>

                {/* Bottom Bar */}
                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 6, pt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ opacity: 0.5 }}>
                        © {new Date().getFullYear()} OBS Online Banking System. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
