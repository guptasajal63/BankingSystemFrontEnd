import React, { useState, useEffect } from "react";
import AccountService from "../services/account.service";
import {
    Container, Typography, Card, CardContent, Grid, Button, Box, Alert, MenuItem, TextField,
    Dialog, DialogTitle, DialogContent, DialogActions, Paper
} from "@mui/material";
import AddCardIcon from '@mui/icons-material/AddCard';
import BusinessIcon from '@mui/icons-material/Business';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountNumber from "../components/AccountNumber";

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [message, setMessage] = useState("");
    const [accountType, setAccountType] = useState("SAVINGS");
    const [open, setOpen] = useState(false);
    const [businessName, setBusinessName] = useState("");
    const [businessAddress, setBusinessAddress] = useState("");
    const [panCardNumber, setPanCardNumber] = useState("");

    useEffect(() => {
        retrieveAccounts();
    }, []);

    const retrieveAccounts = () => {
        AccountService.getMyAccounts()
            .then((response) => {
                setAccounts(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleCreateAccount = () => {
        const payload = {
            accountType,
            businessName: accountType === 'CURRENT' ? businessName : null,
            businessAddress: accountType === 'CURRENT' ? businessAddress : null,
            panCardNumber
        };

        AccountService.createAccount(payload).then(
            (response) => {
                setMessage(response.data.message);
                setOpen(false); // Close dialog
                setBusinessName(""); // Reset
                setBusinessAddress(""); // Reset
                setPanCardNumber(""); // Reset
                retrieveAccounts();
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
            }
        )
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" component="h2">
                    My Accounts
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    startIcon={<AddCardIcon />}
                    sx={{
                        px: 3,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                    }}
                >
                    Open New Account
                </Button>
            </Box>


            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            <Grid container spacing={3}>
                {Array.isArray(accounts) && accounts.map((account) => (
                    <Grid item xs={12} sm={6} md={4} key={account.id}>
                        <Card sx={{
                            minWidth: 275,
                            background: account.accountType === 'SAVINGS'
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Different color for Current
                            color: 'white',
                            borderRadius: 4,
                            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Decorative circle */}
                            <Box sx={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)'
                            }} />

                            <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                    <Box>
                                        <Typography sx={{ fontSize: 13, fontWeight: 'bold', letterSpacing: 1, opacity: 0.8 }} gutterBottom>
                                            {account.accountType} ACCOUNT
                                        </Typography>
                                        {/* Show Business Name if Current Account */}
                                        {account.accountType === 'CURRENT' && account.businessName && (
                                            <Typography variant="caption" display="block" sx={{ opacity: 0.9, fontStyle: 'italic' }}>
                                                {account.businessName}
                                            </Typography>
                                        )}
                                    </Box>
                                    <AccountBalanceWalletIcon sx={{ opacity: 0.8 }} />
                                </Box>

                                <Typography variant="h5" component="div" sx={{ mb: 1, fontFamily: 'monospace', letterSpacing: 2, fontWeight: 'bold' }}>
                                    <AccountNumber accountNumber={account.accountNumber} />
                                </Typography>

                                <Box sx={{ mt: 3 }}>
                                    <Typography sx={{ fontSize: 12, opacity: 0.8 }}>
                                        Available Balance
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold">
                                        ₹{account.balance?.toLocaleString('en-IN')}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {accounts.length === 0 && (
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, bgcolor: '#f8f9fa' }}>
                            <Typography variant="h6" color="text.secondary">No accounts found.</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Get started by opening your first bank account today.</Typography>
                            <Button variant="outlined" onClick={() => setOpen(true)}>Open Account Now</Button>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Open Account Dialog */}
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            >
                <DialogTitle sx={{ fontWeight: '800', fontSize: '1.5rem', color: '#1a237e' }}>
                    Open New Account
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Select the account type and fill in the required details to get started.
                    </Typography>

                    <TextField
                        select
                        fullWidth
                        label="Account Type"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        sx={{ mb: 3 }}
                        InputProps={{ sx: { borderRadius: 3 } }}
                    >
                        <MenuItem value="SAVINGS">Savings Account (Personal)</MenuItem>
                        <MenuItem value="CURRENT">Current Account (Business)</MenuItem>
                    </TextField>

                    <TextField
                        fullWidth
                        label="PAN Card Number"
                        placeholder="ABCDE1234F"
                        value={panCardNumber}
                        onChange={(e) => setPanCardNumber(e.target.value.toUpperCase())}
                        variant="outlined"
                        required
                        sx={{ mb: 3 }}
                        inputProps={{ maxLength: 10 }}
                        InputProps={{ sx: { borderRadius: 3 } }}
                    />

                    {accountType === "CURRENT" && (
                        <Box sx={{ mt: 2, p: 3, bgcolor: '#f5f7fa', borderRadius: 3, border: '1px dashed #ced4da' }}>
                            <Typography variant="subtitle2" fontWeight="bold" color="primary" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                <BusinessIcon sx={{ fontSize: 20, mr: 1 }} />
                                Business Details Required
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Business Name"
                                        placeholder="e.g. Acme Corp"
                                        value={businessName}
                                        onChange={(e) => setBusinessName(e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        required
                                        InputProps={{ sx: { bgcolor: 'white' } }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Registered Office Address"
                                        placeholder="Full address of the business"
                                        value={businessAddress}
                                        onChange={(e) => setBusinessAddress(e.target.value)}
                                        variant="outlined"
                                        size="small" // Small sizing for density
                                        multiline
                                        rows={2}
                                        required
                                        InputProps={{ sx: { bgcolor: 'white' } }}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Cancel</Button>
                    <Button
                        onClick={handleCreateAccount}
                        variant="contained"
                        disabled={
                            !panCardNumber || panCardNumber.length !== 10 ||
                            (accountType === 'CURRENT' && (!businessName || !businessAddress))
                        }
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            boxShadow: '0 4px 14px rgba(25, 118, 210, 0.4)',
                            textTransform: 'none',
                            fontWeight: 'bold'
                        }}
                    >
                        Confirm & Open
                    </Button>
                </DialogActions>
            </Dialog>
        </Container >
    );
};

export default Accounts;
