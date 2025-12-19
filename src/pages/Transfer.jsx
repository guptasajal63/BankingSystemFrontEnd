import React, { useState, useEffect } from "react";
import AccountService from "../services/account.service";
import TransactionService from "../services/transaction.service";
import {
    Container, Typography, TextField, Button, Box, Alert, MenuItem,
    Paper, Grid, InputAdornment, Card, CardContent, Divider, Chip
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const Transfer = () => {
    const [accounts, setAccounts] = useState([]);
    const [fromAccount, setFromAccount] = useState("");
    const [toAccountNumber, setToAccountNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);

    useEffect(() => {
        AccountService.getMyAccounts().then(
            (response) => {
                setAccounts(Array.isArray(response.data) ? response.data : []);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setFromAccount(response.data[0].accountNumber);
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    const handleTransfer = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);

        if (fromAccount === toAccountNumber) {
            setMessage("Cannot transfer funds to the same account.");
            return;
        }

        TransactionService.transferFunds(fromAccount, toAccountNumber, amount).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                setAmount("");
                setToAccountNumber("");
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    const handleQuickAmount = (val) => {
        setAmount(val);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f0f2f5', py: 6 }}>
            <Container maxWidth="md">
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight="800" color="#1565c0" gutterBottom>
                        Transfer Funds
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                        Send money securely to any bank account instantly.
                    </Typography>
                </Box>

                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                            }}
                        >
                            {/* Header Gradient */}
                            <Box sx={{
                                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                                p: 4,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <SwapHorizIcon sx={{ fontSize: 40, opacity: 0.9 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">New Transaction</Typography>
                                </Box>
                            </Box>

                            <Box component="form" onSubmit={handleTransfer} sx={{ p: 4 }}>
                                {message && (
                                    <Alert
                                        severity={successful ? "success" : "error"}
                                        sx={{ mb: 3, borderRadius: 2 }}
                                    >
                                        {message}
                                    </Alert>
                                )}

                                <Grid container spacing={4}>
                                    {/* Link & From Section */}
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Source Account
                                        </Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            value={fromAccount}
                                            onChange={(e) => setFromAccount(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <AccountBalanceWalletIcon color="primary" />
                                                    </InputAdornment>
                                                ),
                                                sx: { borderRadius: 3, bgcolor: '#f8f9fa' }
                                            }}
                                            variant="outlined"
                                        >
                                            {Array.isArray(accounts) && accounts.map((account) => (
                                                <MenuItem key={account.id} value={account.accountNumber}>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                        <Typography fontWeight="500">{account.accountNumber}</Typography>
                                                        <Typography fontWeight="bold" color="success.main">₹{account.balance?.toLocaleString('en-IN')}</Typography>
                                                    </Box>
                                                </MenuItem>
                                            ))}
                                            {accounts.length === 0 && <MenuItem disabled>No accounts found</MenuItem>}
                                        </TextField>
                                    </Grid>

                                    {/* To Section */}
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Beneficiary Details
                                        </Typography>
                                        <TextField
                                            required
                                            fullWidth
                                            placeholder="Enter 12-digit Account Number"
                                            value={toAccountNumber}
                                            onChange={(e) => setToAccountNumber(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <ContactPageIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                                sx: { borderRadius: 3 }
                                            }}
                                        />
                                    </Grid>

                                    {/* Amount Section */}
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="text.secondary" fontWeight="bold" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Transfer Amount
                                        </Typography>
                                        <TextField
                                            required
                                            fullWidth
                                            placeholder="0.00"
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Typography variant="h5" fontWeight="bold" color="text.primary">₹</Typography>
                                                    </InputAdornment>
                                                ),
                                                sx: {
                                                    borderRadius: 3,
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    pl: 1
                                                }
                                            }}
                                        />
                                        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>Quick Add:</Typography>
                                            {[500, 1000, 5000, 10000].map((val) => (
                                                <Chip
                                                    key={val}
                                                    label={`+ ₹${val}`}
                                                    onClick={() => handleQuickAmount(val)}
                                                    clickable
                                                    size="small"
                                                    sx={{ borderRadius: 1 }}
                                                />
                                            ))}
                                        </Box>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 4 }} />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    endIcon={<SendIcon />}
                                    sx={{
                                        borderRadius: 3,
                                        py: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold',
                                        boxShadow: '0 8px 25px rgba(21, 101, 192, 0.25)',
                                        textTransform: 'none'
                                    }}
                                >
                                    Confirm Transfer
                                </Button>

                                <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ mt: 2 }}>
                                    By clicking Confirm, you agree to our Terms of Fund Transfer.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Transfer;
