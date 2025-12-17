import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8443/api/";

const getPendingTransactions = () => {
    return axios.get(API_URL + "transactions/pending", { headers: authHeader() });
};

const approveTransaction = (id) => {
    return axios.put(API_URL + `transactions/${id}/approve`, {}, { headers: authHeader() });
}

const rejectTransaction = (id) => {
    return axios.put(API_URL + `transactions/${id}/reject`, {}, { headers: authHeader() });
}

const searchAccount = (accountNumber) => {
    return axios.get(API_URL + `accounts/search?accountNumber=${accountNumber}`, { headers: authHeader() });
}

const toggleAccountActive = (accountNumber) => {
    return axios.put(API_URL + `accounts/${accountNumber}/toggle-active`, {}, { headers: authHeader() });
}

const deposit = (accountNumber, amount) => {
    return axios.post(API_URL + "accounts/deposit", { accountNumber, amount }, { headers: authHeader() });
}

const getAccountTransactions = (accountNumber) => {
    return axios.get(API_URL + `banker/accounts/${accountNumber}/transactions`, { headers: authHeader() });
};

const downloadAccountStatement = (accountNumber) => {
    return axios.get(API_URL + `banker/accounts/${accountNumber}/statement`, {
        headers: authHeader(),
        responseType: 'blob'
    });
};

const BankerService = {
    getPendingTransactions,
    approveTransaction,
    rejectTransaction,
    searchAccount,
    toggleAccountActive,
    deposit,
    getAccountTransactions,
    downloadAccountStatement
};

export default BankerService;
