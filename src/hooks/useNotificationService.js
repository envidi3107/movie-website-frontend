import useRequest from '@/hooks/useRequest';

export default function useNotificationService() {
    const { get, remove } = useRequest();

    const getAllNotifications = async () => {
        return get('/user-notification/get-all');
    };

    const deleteNotification = async (notificationId) => {
        return remove(
            `/user-notification/delete?notificationId=${notificationId}`
        );
    };

    const clearAllNotifications = async () => {
        return remove('/user-notification/clear-all');
    };

    return {
        getAllNotifications,
        deleteNotification,
        clearAllNotifications,
    };
}
