import axios from "axios";
import { logout } from "../store/authSlice";

const setupInterceptors = (store) => {
    axios.interceptors.response.use(
        (response) => {
            const newToken = response.headers['token-refresh'];
            if (newToken) {
                const user = JSON.parse(localStorage.getItem("user"));
                if (user) {
                    user.token = newToken;
                    localStorage.setItem("user", JSON.stringify(user));
                }
            }
            return response;
        },
        (error) => {
            const originalRequest = error.config;

            if (error.response) {
                // Access Token was expired
                // Exclude login/signin requests from this global 401 handler
                if (error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/signin")) {
                    store.dispatch(logout());
                    window.location.href = "/login"; // Or use history.push if capable
                }
            }

            return Promise.reject(error);
        }
    );
};

export default setupInterceptors;
