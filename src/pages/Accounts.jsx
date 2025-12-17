import React, { useState, useEffect } from "react";
import AccountService from "../services/account.service";
import { Container, Typography, Card, CardContent, Grid, Button, Box, Alert, MenuItem, TextField } from "@mui/material";

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [message, setMessage] = useState("");
    const [accountType, setAccountType] = useState("SAVINGS");

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
        AccountService.createAccount(accountType).then(
            (response) => {
                setMessage(response.data.message);
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

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                        select
                        size="small"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        label="Type"
                        sx={{ width: 150 }}
                    >
                        <MenuItem value="SAVINGS">Savings</MenuItem>
                        <MenuItem value="CURRENT">Current</MenuItem>
                    </TextField>
                    <Button variant="contained" onClick={handleCreateAccount}>Open New Account</Button>
                </Box>
            </Box>

            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            <Grid container spacing={3}>
                {Array.isArray(accounts) && accounts.map((account) => (
                    <Grid item xs={12} sm={6} md={4} key={account.id}>
                        <Card sx={{ minWidth: 275, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', color: 'white' }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom style={{ color: '#eee' }}>
                                    {account.accountType}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {account.accountNumber}
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary" style={{ color: '#eee' }}>
                                    Balance
                                </Typography>
                                <Typography variant="h4">
                                    ₹{account.balance}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {accounts.length === 0 && (
                    <Grid item xs={12}>
                        <Typography variant="body1">No accounts found.</Typography>
                    </Grid>
                )}
            </Grid>
        </Container>
    );
};

export default Accounts;
