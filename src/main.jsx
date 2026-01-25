import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthProvider from './contexts/AuthProviderContext';
import NotificationProvider from './contexts/NotificationContext';
import { BrowserRouter } from 'react-router-dom';
import { WebSocketProvider } from '@/contexts/WebSocketContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <NotificationProvider>
                <AuthProvider>
                    <WebSocketProvider>
                        <App />
                    </WebSocketProvider>
                </AuthProvider>
            </NotificationProvider>
        </BrowserRouter>
    </StrictMode>
);
