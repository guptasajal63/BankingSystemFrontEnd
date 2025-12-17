import React, { useState, useEffect } from "react";
import AccountService from "../services/account.service";
import BillService from "../services/bill.service";
import { Container, Typography, TextField, Button, Box, Alert, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const BillPayments = () => {
    const [accounts, setAccounts] = useState([]);
    const [fromAccount, setFromAccount] = useState("");
    const [billerName, setBillerName] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);
    const [bills, setBills] = useState([]);

    useEffect(() => {
        retrieveAccounts();
        retrieveBills();
    }, []);

    const retrieveAccounts = () => {
        AccountService.getMyAccounts().then(
            (response) => {
                setAccounts(Array.isArray(response.data) ? response.data : []);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setFromAccount(response.data[0].accountNumber);
                }
            },
            (error) => { console.log(error); }
        );
    };

    const retrieveBills = () => {
        BillService.getMyBills().then(
            (response) => { setBills(Array.isArray(response.data) ? response.data : []); },
            (error) => { console.log(error); }
        );
    };

    const handlePayBill = (e) => {
        e.preventDefault();
        setMessage("");
        setSuccessful(false);

        BillService.payBill(fromAccount, billerName, amount).then(
            (response) => {
                setMessage(response.data.message);
                setSuccessful(true);
                setAmount("");
                setBillerName("");
                retrieveBills();
                retrieveAccounts(); // Update balance
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage(resMessage);
                setSuccessful(false);
            }
        );
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Typography variant="h4" gutterBottom>Pay Bill</Typography>
                <Box component="form" onSubmit={handlePayBill} sx={{ mt: 2 }}>
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
                        label="Biller Name (e.g., Electric Co, Credit Card)"
                        value={billerName}
                        onChange={(e) => setBillerName(e.target.value)}
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
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Pay Bill
                    </Button>
                    {message && <Alert severity={successful ? "success" : "error"}>{message}</Alert>}
                </Box>
            </Paper>

            <Typography variant="h5" gutterBottom>Payment History</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Biller</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(bills) && bills.map((bill) => (
                            <TableRow key={bill.id}>
                                <TableCell>{bill.id}</TableCell>
                                <TableCell>{bill.billerName}</TableCell>
                                <TableCell>₹{bill.amount}</TableCell>
                                <TableCell>{new Date(bill.dueDate).toLocaleDateString()}</TableCell>
                                <TableCell>{bill.status}</TableCell>
                            </TableRow>
                        ))}
                        {bills.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No bill payments found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default BillPayments;
