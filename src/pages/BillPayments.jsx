import React, { useState, useEffect } from "react";
import AccountService from "../services/account.service";
import BillService from "../services/bill.service";
import {
    Container, Typography, TextField, Button, Box, Alert, MenuItem, Paper,
    Grid, Card, CardContent, CardActionArea, Avatar, Divider, CircularProgress,
    Stack, IconButton
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects'; // Electricity
import WifiIcon from '@mui/icons-material/Wifi';
import TvIcon from '@mui/icons-material/Tv';
import OpacityIcon from '@mui/icons-material/Opacity'; // Water
import WhatshotIcon from '@mui/icons-material/Whatshot'; // Gas
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

// Mock Data for Categories and Biller
const BILL_CATEGORIES = [
    { id: 'electricity', name: 'Electricity', icon: <EmojiObjectsIcon fontSize="large" />, color: '#fbc02d', providers: ['Tata Power', 'Adani Electricity', 'State Power Corp', 'BEST'] },
    { id: 'mobile', name: 'Mobile Recharge', icon: <SmartphoneIcon fontSize="large" />, color: '#1976d2', providers: ['Jio', 'Airtel', 'Vi', 'BSNL'] },
    { id: 'broadband', name: 'Broadband', icon: <WifiIcon fontSize="large" />, color: '#ad1457', providers: ['JioFiber', 'Airtel Xstream', 'ACT Fibernet', 'Hathway'] },
    { id: 'dth', name: 'DTH', icon: <TvIcon fontSize="large" />, color: '#5e35b1', providers: ['Tata Play', 'Dish TV', 'Airtel Digital TV', 'Sun Direct'] },
    { id: 'water', name: 'Water', icon: <OpacityIcon fontSize="large" />, color: '#0288d1', providers: ['Municipal Corp', 'Jal Board'] },
    { id: 'gas', name: 'Piped Gas', icon: <WhatshotIcon fontSize="large" />, color: '#e64a19', providers: ['IGL', 'MGL', 'Adani Gas'] },
];

const BillPayments = () => {
    // Core State
    const [step, setStep] = useState(1); // 1: Category, 2: Details/Fetch, 3: Confirm/Pay
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [fromAccount, setFromAccount] = useState("");

    // Form State
    const [provider, setProvider] = useState("");
    const [consumerNumber, setConsumerNumber] = useState("");
    const [amount, setAmount] = useState("");
    const [fetchedBill, setFetchedBill] = useState(null);

    // UI State
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState("");
    const [successful, setSuccessful] = useState(false);

    useEffect(() => {
        retrieveAccounts();
    }, []);

    const retrieveAccounts = () => {
        AccountService.getMyAccounts().then(
            (response) => {
                const accs = Array.isArray(response.data) ? response.data : [];
                setAccounts(accs);
                if (accs.length > 0) setFromAccount(accs[0].accountNumber);
            },
            (error) => console.log(error)
        );
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setProvider("");
        setConsumerNumber("");
        setAmount("");
        setFetchedBill(null);
        setStep(2);
        setMessage("");
    };

    const handleBack = () => {
        if (step === 3) setStep(2);
        else if (step === 2) {
            setStep(1);
            setSelectedCategory(null);
        }
    };

    const handleFetchBill = () => {
        if (!provider || !consumerNumber) {
            setMessage("Please fill in all details");
            setSuccessful(false);
            return;
        }

        setFetching(true);
        setMessage("");

        // SIMULATE API CALL TO BILLER
        setTimeout(() => {
            const randomAmount = Math.floor(Math.random() * (5000 - 500 + 1)) + 500;
            const isRecharge = selectedCategory.id === 'mobile';

            setFetchedBill({
                name: "Obs User", // Ideally fetch logged in user's name or random
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                billDate: new Date().toLocaleDateString(),
                billNumber: "BILL" + Math.floor(Math.random() * 10000000),
                amount: isRecharge ? 0 : randomAmount, // Recharge needs manual input usually
            });

            if (!isRecharge) setAmount(randomAmount);
            setFetching(false);
            setStep(3);
        }, 1500);
    };

    const handlePayBill = () => {
        setLoading(true);
        setMessage("");

        // Construct a realistic biller string for transaction history
        const fullBillerName = `${selectedCategory.name} - ${provider} (${consumerNumber})`;

        BillService.payBill(fromAccount, fullBillerName, amount).then(
            (response) => {
                setMessage("Payment Successful!");
                setSuccessful(true);
                setLoading(false);
                setFetchedBill(null);
                // Don't auto-redirect, let them see the success
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setMessage("Payment Failed: " + resMessage);
                setSuccessful(false);
                setLoading(false);
            }
        );
    };

    // --- RENDER HELPERS ---

    const renderStep1_Categories = () => (
        <Grid container spacing={3}>
            {BILL_CATEGORIES.map((cat) => (
                <Grid item xs={6} md={4} key={cat.id}>
                    <Card
                        elevation={2}
                        sx={{
                            height: '100%',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-5px)', borderColor: 'primary.main', border: 1 }
                        }}
                    >
                        <CardActionArea
                            onClick={() => handleCategorySelect(cat)}
                            sx={{ height: '100%', p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Avatar sx={{ bgcolor: cat.color, width: 60, height: 60, mb: 2 }}>
                                {cat.icon}
                            </Avatar>
                            <Typography variant="subtitle1" fontWeight="bold" align="center">
                                {cat.name}
                            </Typography>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    const renderStep2_Details = () => (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Avatar sx={{ bgcolor: selectedCategory.color, mr: 2 }}>{selectedCategory.icon}</Avatar>
                <Typography variant="h5">{selectedCategory.name}</Typography>
            </Box>

            <TextField
                select
                margin="normal"
                required
                fullWidth
                label="Select Provider"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
            >
                {selectedCategory.providers.map((p) => (
                    <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
            </TextField>

            <TextField
                margin="normal"
                required
                fullWidth
                label={selectedCategory.id === 'mobile' ? "Mobile Number" : "Consumer Number / ID"}
                value={consumerNumber}
                onChange={(e) => setConsumerNumber(e.target.value)}
                // helperText="Check your physical bill for this identifier"
                helperText="For this DEMO, you can enter any random number (e.g., 55667788)"
            />

            <Button
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 3 }}
                onClick={handleFetchBill}
                disabled={fetching}
            >
                {fetching ? <CircularProgress size={24} color="inherit" /> : "Fetch Bill"}
            </Button>
        </Paper>
    );

    const renderStep3_Pay = () => (
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={handleBack} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h5">Confirm Payment</Typography>
            </Box>

            {/* Bill Details Card */}
            <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9f9f9', mb: 3 }}>
                <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Provider</Typography>
                        <Typography fontWeight="bold">{provider}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Consumer ID</Typography>
                        <Typography fontWeight="bold">{consumerNumber}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Bill Number</Typography>
                        <Typography fontWeight="bold">{fetchedBill.billNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography color="text.secondary">Due Date</Typography>
                        <Typography fontWeight="bold">{fetchedBill.dueDate}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                        <Typography variant="h6">Total Amount</Typography>
                        {selectedCategory.id === 'mobile' ? (
                            <TextField
                                size="small"
                                type="number"
                                required
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                label="Enter Amount"
                                sx={{ width: 150 }}
                            />
                        ) : (
                            <Typography variant="h5" color="primary.main" fontWeight="bold">₹{amount}</Typography>
                        )}
                    </Box>
                </Stack>
            </Paper>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>Pay From Account</Typography>
            <TextField
                select
                fullWidth
                size="small"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
                sx={{ mb: 3 }}
            >
                {accounts.map((account) => (
                    <MenuItem key={account.id} value={account.accountNumber}>
                        {account.accountNumber} (Bal: ₹{account.balance})
                    </MenuItem>
                ))}
            </TextField>

            {message && <Alert severity={successful ? "success" : "error"} sx={{ mb: 2 }}>{message}</Alert>}

            {!successful && (
                <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    color="success"
                    onClick={handlePayBill}
                    disabled={loading || !amount}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${amount}`}
                </Button>
            )}

            {successful && (
                <Button variant="outlined" fullWidth onClick={() => { setStep(1); setSuccessful(false); setMessage(""); }}>
                    Pay Another Bill
                </Button>
            )}
        </Paper>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                    Bill Payments
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    Pay your utility bills, recharge your mobile, and more instantly.
                </Typography>
            </Box>

            {step === 1 && renderStep1_Categories()}
            {step === 2 && renderStep2_Details()}
            {step === 3 && renderStep3_Pay()}
        </Container>
    );
};

export default BillPayments;
