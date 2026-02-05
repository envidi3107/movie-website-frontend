import axios from 'axios';

const baseApi = import.meta.env.VITE_WEBSITE_BASE_URL + '/api';

const axiosClient = axios.create({
    baseURL: baseApi,
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
    (res) => res.data,
    (error) => {
        const status = error.response?.status || error?.status;

        switch (status) {
            case 401 || 500:
                localStorage.removeItem('token');
                window.location.href = '/login';
                break;
            default:
                return Promise.reject(error);
        }
    }
);

export default axiosClient;
