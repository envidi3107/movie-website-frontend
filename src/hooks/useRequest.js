import axiosClient from '@/libs/axios';
import { useNotification } from '@/contexts/NotificationContext';

export default function () {
    const { showNotification } = useNotification();
    const handleError = (err) => {
        const message =
            err.response?.data?.error || err.message || 'The error is unknown';
        showNotification(message, 'error');
    };

    const get = async (url) => {
        try {
            const data = await axiosClient.get(url);
            return data;
        } catch (err) {
            handleError(err);
        }
    };

    const post = async (url, data, config) => {
        try {
            const result = await axiosClient.post(url, data, config);
            return result;
        } catch (err) {
            handleError(err);
        }
    };

    const put = async (url, data, config) => {
        try {
            const result = await axiosClient.put(url, data, config);
            return result;
        } catch (err) {
            handleError(err);
        }
    };

    const remove = async (url) => {
        try {
            const result = await axiosClient.delete(url);
            return result;
        } catch (err) {
            handleError(err);
        }
    };

    return { get, post, put, remove };
}
