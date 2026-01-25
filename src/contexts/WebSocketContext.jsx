import { createContext, useEffect } from 'react';
import {
    connectWebSocket,
    disconnectWebSocket,
    sendMessage,
} from '@/services/websocket';
import { useContext } from 'react';

export const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
    useEffect(() => {
        connectWebSocket();

        return () => {
            disconnectWebSocket();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
}
