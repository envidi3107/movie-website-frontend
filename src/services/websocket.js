import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

let stompClient = null;

export function connectWebSocket() {
    const token = localStorage.getItem('token');
    console.log(token);
    if (!token) return;

    stompClient = new Client({
        webSocketFactory: () =>
            new SockJS(import.meta.env.VITE_WEBSITE_BASE_URL + '/api/ws'),
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },
        debug: function (str) {
            console.log('debug: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: function (frame) {
            console.log('Connected: ' + frame);
        },
        onStompError: function (frame) {
            console.error('Error: ' + frame);
        },
    });
    stompClient.activate();
}

export function sendMessage(destination, message) {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: destination,
            body: message,
        });
    }
}

export function disconnectWebSocket() {
    if (stompClient) {
        stompClient.deactivate();
    }
}
