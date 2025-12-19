import React, { useState, useEffect } from "react";
import AdminService from "../services/admin.service";
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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Alert,
    InputAdornment,
    IconButton,
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        phoneNumber: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = () => {
        AdminService.getAllUsers().then(
            (response) => {
                setUsers(response.data);
            },
            (error) => {
                console.log(error);
            }
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
        setNewUser({ ...newUser, [name]: value });
    };

    const handleCreateBanker = () => {
        setError("");
        setMessage("");
        AdminService.createBanker(newUser.username, newUser.fullName, newUser.email, newUser.password, newUser.phoneNumber).then(
            (response) => {
                setMessage("Banker created successfully!");
                loadUsers();
                setNewUser({ username: "", fullName: "", email: "", password: "", phoneNumber: "" });
                setTimeout(() => {
                    handleClose();
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

    const handleToggleUserActive = (id) => {
        AdminService.toggleUserActive(id).then(
            (response) => {
                setMessage(response.data.message);
                loadUsers();
            },
            (error) => {
                const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                setError(resMessage);
            }
        );
    };



    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Admin Dashboard
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={handleClickOpen}
                >
                    Create Banker
                </Button>
            </Box>

            <Typography variant="h6" gutterBottom>
                User Management
            </Typography>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Roles</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                    {user.roles.join(", ")}
                                </TableCell>
                                <TableCell>
                                    <span style={{ color: user.active ? 'green' : 'red', fontWeight: 'bold' }}>
                                        {user.active ? "ACTIVE" : "INACTIVE"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color={user.active ? "warning" : "success"}
                                        size="small"
                                        onClick={() => handleToggleUserActive(user.id)}
                                        sx={{ mr: 1 }}
                                    >
                                        {user.active ? "Deactivate" : "Activate"}
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Banker</DialogTitle>
                <DialogContent>
                    {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        autoFocus
                        margin="dense"
                        id="fullName"
                        name="fullName"
                        label="Full Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.fullName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="username"
                        name="username"
                        label="Username"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="email"
                        name="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={newUser.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        variant="outlined"
                        value={newUser.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newUser.phoneNumber}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateBanker} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminDashboard;
