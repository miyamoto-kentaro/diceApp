interface User {
    socketId:string
    userName:string
    joinedroomName:string
}

class Client {
    private socket: SocketIOClient.Socket
    private user:User;

    constructor() {
        this.socket = io();

        this.socket.on("connect", function () {
            console.log("connect");
        });

        this.socket.on("anyonejoin",(room_memberName_list,room_memberId_list)=> {
            $("#home_page").fadeOut(100)
            $("#dice_room").delay(100).fadeIn(100)
            console.log(room_memberName_list)
            console.log(room_memberId_list)
            var room_member_list = document.getElementById('room_member_list');
            room_member_list.innerHTML = ''
            for(var item in room_memberName_list){
                room_member_list.innerHTML += '<li id="' + room_memberId_list[item] + '" class="list-group-item">' + room_memberName_list[item] + '</li>';
            }
        });
        this.socket.on('myexitroom',(room)=>{
            this.socket.emit('someoneexitroom',room)
        })

        this.socket.on('dice_result',(dice_rool,dice_rool_id)=>{
            var room_member = document.getElementById(dice_rool_id)
            room_member.innerHTML += dice_rool
        })

        this.socket.on("disconnect", function (message: any) {
            console.log("disconnect " + message);
            location.reload();
        });
    }
    public exitRoom(){
        $("#dice_room").fadeOut(100)
        $("#home_page").delay(100).fadeIn(100)
        this.socket.emit('exitroom',this.socket.id)
    }
    public showPanel(id: number) {
        switch (id) {
            case 0:
                $("#dice_room").fadeOut(100)
                $("#home_page").delay(100).fadeIn(100)
                break;
            case 1:
                $("#home_page").fadeOut(100)
                $("#dice_room").delay(100).fadeIn(100)
                break;
        }
    }
    public joinRoom(){
        let username = $("#myusername").val();
        let roomname = $("#myroomname").val();
        var room_name:HTMLElement = document.getElementById('showroomname');
        
        if (username.toString().length > 0 && roomname.toString().length > 0) {
            this.socket.emit("joinroom",username,roomname);
            console.log(username + ' join ' + roomname);
            room_name.innerText = "Room Name : " + roomname;
        }
    }
    public test(){
        this.socket.emit("dice_test",this.socket.id)
    }
}

const client = new Client();