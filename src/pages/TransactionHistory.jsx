import React, { useState, useEffect } from "react";
import TransactionService from "../services/transaction.service";
import AccountService from "../services/account.service";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, TextField, Box, Button } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';

const TransactionHistory = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        AccountService.getMyAccounts().then(
            (response) => {
                setAccounts(Array.isArray(response.data) ? response.data : []);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    setSelectedAccount(response.data[0].accountNumber);
                }
            },
            (error) => {
                console.log(error);
            }
        );
    }, []);

    useEffect(() => {
        if (selectedAccount) {
            retrieveTransactions(selectedAccount);
        }
    }, [selectedAccount]);

    const retrieveTransactions = (accountNumber) => {
        TransactionService.getTransactionHistory(accountNumber).then(
            (response) => {
                setTransactions(Array.isArray(response.data) ? response.data : []);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    const handleDownloadInvoice = (transactionId) => {
        TransactionService.downloadInvoice(transactionId).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${transactionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }).catch(error => {
            console.error("Error downloading invoice:", error);
        });
    };

    const handleDownloadStatement = () => {
        if (!selectedAccount) return;

        TransactionService.downloadStatement(selectedAccount).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `statement_${selectedAccount}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }).catch(error => {
            console.error("Error downloading statement:", error);
        });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Transaction History
                </Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadStatement()}
                        disabled={!selectedAccount}
                    >
                        Statement
                    </Button>
                    <TextField
                        select
                        label="Select Account"
                        value={selectedAccount}
                        onChange={(e) => setSelectedAccount(e.target.value)}
                        sx={{ width: 250 }}
                    >
                        {Array.isArray(accounts) && accounts.map((account) => (
                            <MenuItem key={account.id} value={account.accountNumber}>
                                {account.accountNumber}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Target Account</TableCell>
                            <TableCell align="center">Invoice</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(transactions) && transactions.map((transaction) => (
                            <TableRow
                                key={transaction.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {transaction.id}
                                </TableCell>
                                <TableCell>{new Date(transaction.timestamp).toLocaleString()}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell align="right" sx={{ color: transaction.amount > 0 ? 'green' : 'red' }}>
                                    {transaction.amount}
                                </TableCell>
                                <TableCell>{transaction.targetAccountNumber}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<DownloadIcon />}
                                        onClick={() => handleDownloadInvoice(transaction.id)}
                                    >
                                        PDF
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {transactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">No transactions found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default TransactionHistory;
