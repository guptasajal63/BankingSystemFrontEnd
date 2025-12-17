import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8443/api/admin/";

const getAllUsers = () => {
    return axios.get(API_URL + "users", { headers: authHeader() });
};

const createBanker = (username, email, password, phoneNumber) => {
    return axios.post(API_URL + "create-banker", {
        username,
        email,
        password,
        phoneNumber
    }, { headers: authHeader() });
};

const toggleUserActive = (id) => {
    return axios.put(API_URL + `users/${id}/toggle-active`, {}, { headers: authHeader() });
};

const deleteUser = (id) => {
    return axios.delete(API_URL + `users/${id}`, { headers: authHeader() });
};

const AdminService = {
    getAllUsers,
    createBanker,
    toggleUserActive,
    deleteUser
};

export default AdminService;
