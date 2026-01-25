import Notification from '@/components/Notification';
import { createContext, useContext, useState } from 'react';

export const NotificationContext = createContext(null);

export default function NotificationProvider({ children }) {
    const [notification, setNotification] = useState({
        isOpen: false,
        message: '',
        type: '',
    });

    function showNotification(message, type) {
        setNotification({
            isOpen: true,
            message,
            type,
        });
    }

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification.isOpen && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() =>
                        setNotification({ ...notification, isOpen: false })
                    }
                />
            )}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context)
        throw new Error('NotificationContext must be use in provider.');

    return context;
};
