import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8443/api/bills/";

const payBill = (accountNumber, billerName, amount) => {
    return axios.post(
        API_URL + `pay?accountNumber=${accountNumber}&billerName=${billerName}&amount=${amount}`,
        {},
        { headers: authHeader() }
    );
};

const getMyBills = () => {
    return axios.get(API_URL + "my-bills", { headers: authHeader() });
}

const BillService = {
    payBill,
    getMyBills
};

export default BillService;
