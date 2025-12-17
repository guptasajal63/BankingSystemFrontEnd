import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                py: 6,
                px: 2,
                mt: 'auto',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[200]
                        : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Online Banking System
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Secure, fast, and reliable banking for everyone.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Quick Links
                        </Typography>
                        <Link href="/" color="inherit" display="block">
                            Home
                        </Link>
                        <Link href="/about" color="inherit" display="block">
                            About Us
                        </Link>
                        <Link href="/contact" color="inherit" display="block">
                            Contact Support
                        </Link>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="h6" color="text.primary" gutterBottom>
                            Legal
                        </Typography>
                        <Link href="/privacy" color="inherit" display="block">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" color="inherit" display="block">
                            Terms of Service
                        </Link>
                    </Grid>
                </Grid>
                <Box mt={5}>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {'Copyright © '}
                        <Link color="inherit" href="https://yourbank.com/">
                            Online Banking System
                        </Link>{' '}
                        {new Date().getFullYear()}
                        {'.'}
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
