'use client'

import { useEffect } from 'react';
import io from 'socket.io-client';

interface CodeEvent {
    token: string;
    data: any;
    message: string;
}

export default function Home() {
    const device = "380663761344"
    useEffect(() => {
        const socket = io();

        socket.emit('StartConnection', device);
        socket.on('code', ({ token, data, message }: CodeEvent) => {
            console.log("I am here")
            if (token === device) {
                console.log('code',data, message)
            }
        });

        socket.on('connection-open', ({
            token,
            user,
            ppUrl
        }) => {
            if (token == device) {
                console.log('connection-open', token, user, ppUrl)
            }
        })

        return () => {
            socket.disconnect();
        };
    }, []);

    return <div>WebSocket Test Page</div>;
}
