interface User{
    username:string;
    room:string;
}

class Client {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io();

        this.socket.on("connect", function () {
            console.log("connect");
            
        });

        this.socket.on("someonejoin", function (username: string, roomname:string) {
            var room_member_list = document.getElementById('room_member');
            room_member_list.innerHTML += '<li class="list-group-item">' + username + '</li>';
            alert('yse');
        });

        this.socket.on("myjoin",function (username: string, roomname:string) {
            var room_member_list = document.getElementById('room_member');
            room_member_list.innerHTML += '<li class="list-group-item">' + username + '</li>';
            $("#home_page").fadeOut(100)
            $("#dice_room").delay(100).fadeIn(100)
        });

        this.socket.on("disconnect", function (message: any) {
            console.log("disconnect " + message);
            location.reload();
        });
    }
    public exitRoom(){;
        $("#dice_room").fadeOut(100)
        $("#home_page").delay(100).fadeIn(100)
    }
    public showPanel(id: number) {
        switch (id) {
            case 0:
                $("#home_page").fadeOut(100)
                $("#dice_room").delay(100).fadeIn(100)
                break;
            case 1:
                $("#dice_room").fadeOut(100)
                $("#home_page").delay(100).fadeIn(100)
                break;
        }
    }

    public joinRoom(){
        let username = $("#myusername").val();
        let roomname = $("#myroomname").val();
        var room_name:HTMLElement = document.getElementById('showroomname');
        
        if (username.toString().length > 0 && roomname.toString().length > 0) {
            this.socket.emit("joinroom", username,roomname);
            console.log(username + ' join ' + roomname);
            
            room_name.innerText = "Room Name : " + roomname;
        }
    }
}

const client = new Client();