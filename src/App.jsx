import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Container } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Accounts from "./pages/Accounts";
import Transfer from "./pages/Transfer";
import TransactionHistory from "./pages/TransactionHistory";
import BillPayments from "./pages/BillPayments";
import BankerDashboard from "./pages/BankerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import RecurringPayments from "./pages/RecurringPayments";
import About from "./pages/About";

import { logout } from "./store/authSlice";
import { clearMessage } from "./store/messageSlice";

import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showBankerBoard, setShowBankerBoard] = useState(false);

  // ... (rest of logic) ...
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  let location = useLocation();

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage());
    }
  }, [dispatch, location]);

  useEffect(() => {
    if (currentUser && currentUser.roles) {
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
      setShowBankerBoard(currentUser.roles.includes("ROLE_BANKER"));
    } else {
      setShowAdminBoard(false);
      setShowBankerBoard(false);
    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            component={Link}
            to="/"
          >
            <AccountBalanceIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              OBS
            </Link>
          </Typography>

          {currentUser ? (
            <Box>
              {showAdminBoard && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
              )}
              {showBankerBoard && (
                <Button color="inherit" component={Link} to="/banker">
                  Banker
                </Button>
              )}
              {!showAdminBoard && !showBankerBoard && (
                <>
                  <Button color="inherit" component={Link} to="/accounts">
                    Accounts
                  </Button>
                  <Button color="inherit" component={Link} to="/transfer">
                    Transfer
                  </Button>
                  <Button color="inherit" component={Link} to="/bills">
                    Bills
                  </Button>
                  <Button color="inherit" component={Link} to="/recurring">
                    Recurring
                  </Button>
                  <Button color="inherit" component={Link} to="/transactions">
                    History
                  </Button>
                </>
              )}
              <Button color="inherit" component={Link} to="/profile">
                {currentUser.username}
              </Button>
              <Button color="inherit" onClick={logOut}>
                LogOut
              </Button>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 3, mb: 3, flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/bills" element={<BillPayments />} />
            <Route path="/recurring" element={<RecurringPayments />} />
            <Route path="/banker" element={<BankerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Container>

      <Footer />
    </Box>
  );
};

export default App;
