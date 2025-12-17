import React, { useState, useEffect } from "react";
import BankerService from "../services/banker.service";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Box, Alert, TextField,
    Card, CardContent, Grid, Divider, Tab, Tabs
} from "@mui/material";

const BankerDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Account Management State
    const [searchAccountNumber, setSearchAccountNumber] = useState("");
    const [accountDetails, setAccountDetails] = useState(null);
    const [depositAmount, setDepositAmount] = useState("");
    const [accountTransactions, setAccountTransactions] = useState([]);

    const handleDownloadStatement = (accountNumber) => {
        BankerService.downloadAccountStatement(accountNumber).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `statement_${accountNumber}.pdf`);
                document.body.appendChild(link);
                link.click();
            },
            (error) => {
                setMessage("Could not download statement.");
            }
        );
    };

    useEffect(() => {
        if (tabValue === 0) {
            retrieveTransactions();
        }
    }, [tabValue]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setMessage("");
        setSuccessful(false);
    };

    const retrieveTransactions = () => {
        BankerService.getPendingTransactions().then(
            (response) => {
                setTransactions(response.data);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const handleApprove = (id) => {
        BankerService.approveTransaction(id).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                retrieveTransactions();
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    }

    const handleReject = (id) => {
        BankerService.rejectTransaction(id).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                retrieveTransactions();
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    }

    // Account Management Functions
    const handleSearch = () => {
        setMessage("");
        setAccountDetails(null);
        setAccountTransactions([]);
        BankerService.searchAccount(searchAccountNumber).then(
            (response) => {
                setAccountDetails(response.data);
                BankerService.getAccountTransactions(searchAccountNumber).then(
                    (res) => {
                        setAccountTransactions(res.data);
                    },
                    (err) => {
                        console.log("Error fetching transactions", err);
                    }
                );
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    const handleToggleActive = () => {
        BankerService.toggleAccountActive(accountDetails.accountNumber).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                handleSearch(); // Refresh details
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    const handleDeposit = () => {
        BankerService.deposit(accountDetails.accountNumber, depositAmount).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                setDepositAmount("");
                handleSearch(); // Refresh details
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Banker Dashboard
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="banker tabs">
                    <Tab label="Pending Transactions" />
                    <Tab label="Manage Accounts" />
                </Tabs>
            </Box>

            {message && (
                <Alert severity={successful ? "success" : "error"} sx={{ mb: 2 }}>{message}</Alert>
            )}

            {tabValue === 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Account</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Target Account</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.id}</TableCell>
                                    <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                                    <TableCell>{transaction.account ? transaction.account.accountNumber : 'N/A'}</TableCell>
                                    <TableCell>{Math.abs(transaction.amount)}</TableCell>
                                    <TableCell>{transaction.targetAccountNumber}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="success" size="small" onClick={() => handleApprove(transaction.id)} sx={{ mr: 1 }}>
                                            Approve
                                        </Button>
                                        <Button variant="contained" color="error" size="small" onClick={() => handleReject(transaction.id)}>
                                            Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No pending transactions</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {tabValue === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                        <TextField
                            label="Account Number"
                            variant="outlined"
                            value={searchAccountNumber}
                            onChange={(e) => setSearchAccountNumber(e.target.value)}
                            fullWidth
                        />
                        <Button variant="contained" onClick={handleSearch} size="large">Search</Button>
                    </Box>

                    {accountDetails && (
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Account Details</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography><strong>Account Number:</strong> {accountDetails.accountNumber}</Typography>
                                        <Typography><strong>User ID:</strong> {accountDetails.userId}</Typography>
                                        <Typography><strong>Username:</strong> {accountDetails.username}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography><strong>Balance:</strong> ₹{accountDetails.balance}</Typography>
                                        <Typography>
                                            <strong>Status:</strong>
                                            <span style={{ color: accountDetails.active ? 'green' : 'red', fontWeight: 'bold', marginLeft: '5px' }}>
                                                {accountDetails.active ? "ACTIVE" : "FROZEN"}
                                            </span>
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 2 }} />

                                <Typography variant="h6" gutterBottom>Actions</Typography>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color={accountDetails.active ? "warning" : "success"}
                                            onClick={handleToggleActive}
                                        >
                                            {accountDetails.active ? "Freeze Account" : "Unfreeze Account"}
                                        </Button>
                                    </Grid>

                                    <Grid item xs={12}><Divider /></Grid>

                                    <Grid item xs={12} sm={4}>
                                        <TextField
                                            label="Deposit Amount"
                                            type="number"
                                            fullWidth
                                            value={depositAmount}
                                            onChange={(e) => setDepositAmount(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button variant="contained" color="primary" onClick={handleDeposit}>
                                            Add Money
                                        </Button>
                                    </Grid>
                                </Grid>

                            </CardContent>

                            <Divider />

                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="h6">Transaction History</Typography>
                                    <Button variant="contained" color="secondary" onClick={() => handleDownloadStatement(accountDetails.accountNumber)}>
                                        Download Statement
                                    </Button>
                                </Box>

                                <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
                                    <Table stickyHeader size="small" aria-label="account transactions">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>ID</TableCell>
                                                <TableCell>Date</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {accountTransactions.map((t) => (
                                                <TableRow key={t.id}>
                                                    <TableCell>{t.id}</TableCell>
                                                    <TableCell>{new Date(t.timestamp).toLocaleString()}</TableCell>
                                                    <TableCell>{t.type}</TableCell>
                                                    <TableCell sx={{ color: t.type === 'CREDIT' ? 'green' : 'red' }}>
                                                        {t.type === 'CREDIT' ? '+' : '-'}₹{Math.abs(t.amount)}
                                                    </TableCell>
                                                    <TableCell>{t.status}</TableCell>
                                                </TableRow>
                                            ))}
                                            {accountTransactions.length === 0 && (
                                                <TableRow>
                                                    <TableCell colSpan={5} align="center">No transactions found</TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    )}
                </Box>
            )}
        </Container>
    );
};

export default BankerDashboard;
