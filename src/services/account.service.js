import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8443/api/accounts/";

const getMyAccounts = () => {
    return axios.get(API_URL + "my-accounts", { headers: authHeader() });
};

const createAccount = (accountType) => {
    return axios.post(API_URL + "create?accountType=" + accountType, {}, { headers: authHeader() });
}

const AccountService = {
    getMyAccounts,
    createAccount
};

export default AccountService;
