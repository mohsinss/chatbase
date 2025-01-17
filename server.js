// server.js
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import connectMongo from "./libs/mongoose.js";
import wa from './server/whatsapp.js';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
    const server = createServer(handle);
    const io = new Server(server);
    await connectMongo();

    io.on('connection', (socket) => {
        console.log("A user connected");

        socket.on("StartConnection", (data) => {
          wa.connectToWhatsApp(data, io);
        });
      
        socket.on("ConnectViaCode", (data) => {
          console.log('ConnectViaCode')
          wa.connectToWhatsApp(data, io, true);
        });
      
        socket.on("LogoutDevice", (device) => {
          wa.deleteCredentials(device, io);
        });
      
        socket.on("SendMessage", (data) => {
          wa.sendMessage(data.token, data.number, data.message)
            .then(response => {
              socket.emit("MessageSent", response);
            })
            .catch(error => {
              socket.emit("MessageError", error);
            });
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
