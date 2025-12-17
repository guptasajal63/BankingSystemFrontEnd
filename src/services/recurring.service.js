import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8443/api/recurring/";

const create = (data) => {
    return axios.post(API_URL + "create", data, { headers: authHeader() });
};

const getByAccount = (accountNumber) => {
    return axios.get(API_URL + accountNumber, { headers: authHeader() });
};

const stop = (id) => {
    return axios.put(API_URL + id + "/stop", {}, { headers: authHeader() });
};

const RecurringService = {
    create,
    getByAccount,
    stop
};

export default RecurringService;
