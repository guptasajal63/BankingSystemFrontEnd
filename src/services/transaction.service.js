import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8443/api/transactions/";

const transferFunds = (fromAccountNumber, toAccountNumber, amount) => {
    return axios.post(
        API_URL + "transfer",
        {
            fromAccountNumber,
            toAccountNumber,
            amount,
        },
        { headers: authHeader() }
    );
};

const getTransactionHistory = (accountNumber) => {
    return axios.get(API_URL + accountNumber, { headers: authHeader() });
}

const downloadInvoice = (transactionId) => {
    return axios.get(API_URL + transactionId + "/invoice", {
        headers: authHeader(),
        responseType: 'blob'
    });
}

const downloadStatement = (accountNumber) => {
    return axios.get(API_URL + accountNumber + "/statement", {
        headers: authHeader(),
        responseType: 'blob'
    });
}

const TransactionService = {
    transferFunds,
    getTransactionHistory,
    downloadInvoice,
    downloadStatement
};

export default TransactionService;
