import React, { useState, useEffect } from "react";
import RecurringService from "../services/recurring.service";
import AccountService from "../services/account.service";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem,
    TextField,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    FormControl,
    InputLabel,
    Select,
    Chip
} from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';

const RecurringPayments = () => {
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState("");
    const [payments, setPayments] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [newPayment, setNewPayment] = useState({
        amount: "",
        targetAccountNumber: "",
        frequency: "MONTHLY",
        startDate: new Date().toISOString().split('T')[0],
        endDate: ""
    });

    useEffect(() => {
        AccountService.getMyAccounts().then(
            (response) => {
                const accs = Array.isArray(response.data) ? response.data : [];
                setAccounts(accs);
                if (accs.length > 0) {
                    setSelectedAccount(accs[0].accountNumber);
                }
            },
            (error) => console.log(error)
        );
    }, []);

    useEffect(() => {
        if (selectedAccount) {
            retrievePayments(selectedAccount);
        }
    }, [selectedAccount]);

    const retrievePayments = (accountNumber) => {
        RecurringService.getByAccount(accountNumber).then(
            (response) => {
                setPayments(Array.isArray(response.data) ? response.data : []);
            },
            (error) => console.log(error)
        );
    };

    const handleClickOpen = () => {
        setOpen(true);
        setMessage("");
        setError("");
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPayment({ ...newPayment, [name]: value });
    };

    const handleSubmit = () => {
        setError("");
        setMessage("");

        const payload = {
            ...newPayment,
            fromAccountNumber: selectedAccount,
            endDate: newPayment.endDate || null
        };

        RecurringService.create(payload).then(
            (response) => {
                setMessage("Payment scheduled successfully!");
                retrievePayments(selectedAccount);
                setTimeout(() => {
                    handleClose();
                    setNewPayment({
                        amount: "",
                        targetAccountNumber: "",
                        frequency: "MONTHLY",
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: ""
                    });
                    setMessage("");
                }, 1500);
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setError(resMessage);
            }
        );
    };

    const handleStop = (id) => {
        RecurringService.stop(id).then(
            () => {
                retrievePayments(selectedAccount);
            },
            (error) => console.log(error)
        );
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Recurring Payments
                </Typography>
                <TextField
                    select
                    label="Select Account"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    sx={{ width: 250 }}
                >
                    {accounts.map((account) => (
                        <MenuItem key={account.id} value={account.accountNumber}>
                            {account.accountNumber}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Button
                    variant="contained"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={handleClickOpen}
                    disabled={!selectedAccount}
                >
                    Schedule New Payment
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Target Account</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Next Payment</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {payments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.id}</TableCell>
                                <TableCell>{payment.targetAccountNumber}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell>{payment.frequency}</TableCell>
                                <TableCell>{payment.nextPaymentDate}</TableCell>
                                <TableCell>{payment.endDate || "Indefinite"}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={payment.status}
                                        color={payment.status === 'ACTIVE' ? 'success' : payment.status === 'STOPPED' ? 'error' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {payment.status === 'ACTIVE' && (
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<StopCircleIcon />}
                                            onClick={() => handleStop(payment.id)}
                                        >
                                            Stop
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {payments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No recurring payments found</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Schedule Recurring Payment</DialogTitle>
                <DialogContent>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    <TextField
                        autoFocus
                        margin="dense"
                        id="targetAccountNumber"
                        name="targetAccountNumber"
                        label="Target Account Number"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newPayment.targetAccountNumber}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="amount"
                        name="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newPayment.amount}
                        onChange={handleChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="frequency-label">Frequency</InputLabel>
                        <Select
                            labelId="frequency-label"
                            id="frequency"
                            name="frequency"
                            value={newPayment.frequency}
                            label="Frequency"
                            onChange={handleChange}
                        >
                            <MenuItem value="DAILY">Daily</MenuItem>
                            <MenuItem value="WEEKLY">Weekly</MenuItem>
                            <MenuItem value="MONTHLY">Monthly</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        id="startDate"
                        name="startDate"
                        label="Start Date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newPayment.startDate}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="endDate"
                        name="endDate"
                        label="End Date (Optional)"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newPayment.endDate}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Schedule</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RecurringPayments;
