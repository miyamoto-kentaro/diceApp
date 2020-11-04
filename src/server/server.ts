import express from "express"
import path from "path"
import http from "http"
import socketIO from "socket.io"
import User from "./user"
const port: number = 3000

var userHash = {};

class App {
    private server: http.Server
    private port: number

    private io: socketIO.Server
    private userHash:{ [socketId:string]: User } = {}

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
                socket.to(userHash[socket.id].joinedroomName).emit('someoneexitroom',socket.id)
            });

            socket.on('joinroom',(username,roomname) => {
                userHash[socket.id] = new User(socketId,username,roomname);
                socket.join(roomname);
                console.log(userHash[socket.id].userName + ' join ' + userHash[socket.id].userName)
                var room_memberId_list:string[] = [];
                var room_memberName_list:string[] = [];
                var member_num = 0;
                for(var userid in userHash){
                    if(userHash[userid].joinedroomName == roomname){
                        room_memberId_list[member_num] = userid
                        room_memberName_list[member_num] = userHash[userid].userName;
                        member_num += 1
                    }
                }
                console.log(room_memberName_list)
                console.log(room_memberId_list)
                socket.to(roomname).emit('anyonejoin',room_memberName_list,room_memberId_list);
                socket.emit('anyonejoin',room_memberName_list,room_memberId_list)
            })

            socket.on('exitroom',(disconnectId)=>{
                var room = userHash[disconnectId].joinedroomName
                delete userHash[disconnectId]
                socket.to(room).emit('myexitroom',room)
                console.log('exit')
            })
            socket.on('someoneexitroom',(room)=>{
                console.log('next')
                var room_memberId_list:string[] = [];
                var room_memberName_list:string[] = [];
                var member_num = 0;
                for(var userid in userHash){
                    if(userHash[userid].joinedroomName == room){
                        room_memberId_list[member_num] = userid
                        room_memberName_list[member_num] = userHash[userid].userName;
                        member_num += 1
                    }
                }
                socket.emit('anyonejoin',room_memberName_list)
            })
            socket.on('dice_test',(dice_rool_id)=>{
                let dice_rool = 'test'
                socket.to(userHash[dice_rool_id].joinedroomName).emit('dice_result',dice_rool,dice_rool_id)
                socket.emit('dice_result',dice_rool,dice_rool_id)
            });
        });
    }

    public Start() {
        this.server.listen(this.port);
        console.log( `Server listening on port ${this.port}.` );
    }
}

new App(port).Start();