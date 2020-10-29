import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"

const port: number = 3000

class App {
    private server: http.Server
    private port: number

    private io: socketIO.Server

    constructor(port: number) {
        this.port = port;

        const app = express();
        app.use(express.static(path.join(__dirname, '../client')));
        
        app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist')));
        app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')));

        this.server = new http.Server(app);
        this.io = socketIO(this.server);

        this.io.on('connection', (socket: socketIO.Socket) => {
            const socketId = socket.id;
            console.log('a user connected : ' + socketId);

            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
            });

            socket.on('joinroom',(username,roomname) => {
                console.log(username + ' join ' + roomname);
                socket.join(roomname);
                socket.broadcast.to(roomname).emit('someonejoin',username,roomname);
                socket.emit('myjoin',username,roomname);
            });
        });
    }

    public Start() {
        this.server.listen(this.port);
        console.log( `Server listening on port ${this.port}.` );
    }
}

new App(port).Start();