import React, { useState, useEffect } from "react";
import AccountService from "../services/account.service";
import TransactionService from "../services/transaction.service";
import { Container, Typography, TextField, Button, Box, Alert, MenuItem, Paper, Grid } from "@mui/material";

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

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Fund Transfer
                </Typography>

                <Box component="form" onSubmit={handleTransfer} sx={{ mt: 2 }}>
                    <TextField
                        select
                        margin="normal"
                        required
                        fullWidth
                        label="From Account"
                        value={fromAccount}
                        onChange={(e) => setFromAccount(e.target.value)}
                    >
                        {Array.isArray(accounts) && accounts.map((account) => (
                            <MenuItem key={account.id} value={account.accountNumber}>
                                {account.accountNumber} - ₹{account.balance}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="To Account Number"
                        value={toAccountNumber}
                        onChange={(e) => setToAccountNumber(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Transfer
                    </Button>

                    {message && (
                        <Alert severity={successful ? "success" : "error"}>{message}</Alert>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

export default Transfer;
