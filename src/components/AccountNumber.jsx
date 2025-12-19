import React, { useState } from 'react';
import { Typography, IconButton, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AccountNumber = ({ accountNumber, maskChar = '*', visibleChars = 4 }) => {
    const [show, setShow] = useState(false);

    if (!accountNumber) return <Typography component="span">N/A</Typography>;

    const strNum = String(accountNumber);
    const masked = maskChar.repeat(Math.max(0, strNum.length - visibleChars)) + strNum.slice(-visibleChars);

    const handleToggle = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent card clicks if any
        setShow(!show);
    };

    return (
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <Typography component="span" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                {show ? strNum : masked}
            </Typography>
            <IconButton size="small" onClick={handleToggle} sx={{ color: 'inherit', padding: 0.5 }}>
                {show ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </IconButton>
        </Box>
    );
};

export default AccountNumber;
