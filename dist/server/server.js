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
            socket.on('disconnect', () => {
                console.log('socket disconnected : ' + socket.id);
                if (userHash[socket.id]) {
                    var room = userHash[socket.id].joinedroomName;
                    console.log(userHash[socket.id]);
                    delete userHash[socket.id];
                    console.log(userHash[socket.id]);
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
                    socket.to(room).emit('reloadroom', room_memberName_list, room_memberId_list);
                }
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
                socket.to(roomname).emit('reloadroom', room_memberName_list, room_memberId_list);
                socket.emit('reloadroom', room_memberName_list, room_memberId_list);
            });
            socket.on('exitroom', (disconnectId) => {
                var room = userHash[disconnectId].joinedroomName;
                delete userHash[disconnectId];
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
                socket.to(room).emit('reloadroom', room_memberName_list, room_memberId_list);
            });
            socket.on('reloadroom', (reloadroom) => {
                var room_memberId_list = [];
                var room_memberName_list = [];
                var member_num = 0;
                for (var userid in userHash) {
                    if (userHash[userid].joinedroomName == reloadroom) {
                        room_memberId_list[member_num] = userid;
                        room_memberName_list[member_num] = userHash[userid].userName;
                        member_num += 1;
                    }
                }
                socket.to(reloadroom).emit('reloadroom', room_memberName_list, room_memberId_list);
            });
            socket.on('dice_roll', (dice_roll_id, dice, number) => {
                let dice_roll = userHash[dice_roll_id].Go_dice(dice, number);
                userHash[dice_roll_id].diceRoll = dice_roll;
                socket.to(userHash[dice_roll_id].joinedroomName).emit('dice_result', userHash[dice_roll_id], dice, number);
                socket.emit('dice_result', userHash[dice_roll_id], dice, number);
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