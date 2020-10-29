"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../client')));
        app.use('/jquery', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/jquery/dist')));
        app.use('/bootstrap', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/bootstrap/dist')));
        this.server = new http_1.default.Server(app);
        this.io = socket_io_1.default(this.server);
        this.io.on('connection', (socket) => {
            const socketId = socket.id;
            console.log('a user connected : ' + socketId);
            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
            });
            socket.on('joinroom', (username, roomname) => {
                console.log(username + ' join ' + roomname);
                socket.join(roomname);
                socket.broadcast.to(roomname).emit('someonejoin', username, roomname);
                socket.emit('myjoin', username, roomname);
            });
        });
    }
    Start() {
        this.server.listen(this.port);
        console.log(`Server listening on port ${this.port}.`);
    }
}
new App(port).Start();
//# sourceMappingURL=server.js.map