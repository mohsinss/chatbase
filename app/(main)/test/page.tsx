'use client'

import Script from 'next/script';
import { useEffect } from 'react';
import toast from 'react-hot-toast';


interface CodeEvent {
    token: string;
    data: any;
    message: string;
}

export default function Home() {
    const device = "380663761344"
    // useEffect(() => {
    //     const socket = io('https://chatbase-socket-nqyw.onrender.com', {
    //         transports: ['websocket'], // Force WebSocket transport
    //     });

    //     socket.emit('StartConnection', device);
    //     socket.on('code', ({ token, data, message }: CodeEvent) => {
    //         console.log("I am here")
    //         if (token === device) {
    //             console.log('code',data, message)
    //         }
    //     });

    //     socket.on('connection-open', ({
    //         token,
    //         user,
    //         ppUrl
    //     }) => {
    //         if (token == device) {
    //             console.log('connection-open', token, user, ppUrl)
    //         }
    //     })

    //     return () => {
    //         socket.disconnect();
    //     };
    // }, []);
    useEffect(() => {
        //@ts-ignore
        window.toast = toast;
        //@ts-ignore
        window.PDF2MD_TRIEVE_KEY = process.env.NEXT_PUBLIC_TRIEVE_PDF2MD_API_KEY;
        window.embeddedChatbotConfig = {
            chatbotId: "WoRQ5uROCQkz48MYA9IrV",
            domain: "localhost:3000"
        }
    }, [])
    return (
        <>
            <Script src="http://localhost:3000/embed.min.js" defer></Script>
        </>
    );
}
