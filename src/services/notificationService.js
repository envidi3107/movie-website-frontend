import axiosClient from '@/libs/axios';

export const getAllNotifications = async () => {
    return axiosClient.get('/user-notification/get-all');
};

export const deleteNotification = async (notificationId) => {
    return axiosClient.delete('/user-notification/delete', {
        params: { notificationId },
    });
};

export const clearAllNotifications = async () => {
    return axiosClient.delete('/user-notification/clear-all');
};
