// server.js
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import express from 'express';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const server = express();
    const io = new Server(server);

    server.use(express.static('public'));

    io.on('connection', (socket) => {
        console.log("A user connected");

        socket.on("StartConnection", (data) => {
          console.log("StartConnection");
        });

        socket.on("disconnect", () => {
          console.log("A user disconnected");
        });
    });

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
