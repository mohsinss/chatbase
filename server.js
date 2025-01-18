// server.js
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const server = createServer(handle);
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log("A user connected");

        socket.on("StartConnection", (data) => {
          console.log("StartConnection");
        });

        socket.on("disconnect", () => {
          console.log("A user disconnected");
        });
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log('> Ready on http://localhost:3000');
    });
});
