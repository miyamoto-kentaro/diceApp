"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const user_1 = __importDefault(require("./user"));
const port = 3000;
var userHash = {};
class App {
    constructor(port) {
        this.userHash = {};
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
                socket.to(userHash[socket.id].joinedroomName).emit('someoneexitroom', socket.id);
            });
            socket.on('joinroom', (username, roomname) => {
                userHash[socket.id] = new user_1.default(socketId, username, roomname);
                socket.join(roomname);
                console.log(userHash[socket.id].userName + ' join ' + userHash[socket.id].userName);
                var room_memberId_list = [];
                var room_memberName_list = [];
                var member_num = 0;
                for (var userid in userHash) {
                    if (userHash[userid].joinedroomName == roomname) {
                        room_memberId_list[member_num] = userid;
                        room_memberName_list[member_num] = userHash[userid].userName;
                        member_num += 1;
                    }
                }
                console.log(room_memberName_list);
                console.log(room_memberId_list);
                socket.to(roomname).emit('anyonejoin', room_memberName_list, room_memberId_list);
                socket.emit('anyonejoin', room_memberName_list, room_memberId_list);
            });
            socket.on('exitroom', (disconnectId) => {
                var room = userHash[disconnectId].joinedroomName;
                delete userHash[disconnectId];
                socket.to(room).emit('myexitroom', room);
                console.log('exit');
            });
            socket.on('someoneexitroom', (room) => {
                console.log('next');
                var room_memberId_list = [];
                var room_memberName_list = [];
                var member_num = 0;
                for (var userid in userHash) {
                    if (userHash[userid].joinedroomName == room) {
                        room_memberId_list[member_num] = userid;
                        room_memberName_list[member_num] = userHash[userid].userName;
                        member_num += 1;
                    }
                }
                socket.emit('anyonejoin', room_memberName_list);
            });
            socket.on('dice_test', (dice_rool_id) => {
                let dice_rool = 'test';
                socket.to(userHash[dice_rool_id].joinedroomName).emit('dice_result', dice_rool, dice_rool_id);
                socket.emit('dice_result', dice_rool, dice_rool_id);
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