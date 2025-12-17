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
    Alert
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        phoneNumber: ""
    });
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
        AdminService.createBanker(newUser.username, newUser.email, newUser.password, newUser.phoneNumber).then(
            (response) => {
                setMessage("Banker created successfully!");
                loadUsers();
                setNewUser({ username: "", email: "", password: "", phoneNumber: "" });
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

    const handleDeleteUser = (id) => {
        if (window.confirm("Are you sure you want to delete this user? This will delete all their accounts and transactions.")) {
            AdminService.deleteUser(id).then(
                (response) => {
                    setMessage(response.data.message);
                    loadUsers();
                },
                (error) => {
                    const resMessage = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
                    setError(resMessage);
                }
            );
        }
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
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete
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
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={newUser.password}
                        onChange={handleChange}
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
