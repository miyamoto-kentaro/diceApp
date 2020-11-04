var Client = /** @class */ (function () {
    function Client() {
        var _this = this;
        this.socket = io();
        this.socket.on("connect", function () {
            console.log("connect");
        });
        this.socket.on("anyonejoin", function (room_memberName_list, room_memberId_list) {
            $("#home_page").fadeOut(100);
            $("#dice_room").delay(100).fadeIn(100);
            console.log(room_memberName_list);
            console.log(room_memberId_list);
            var room_member_list = document.getElementById('room_member_list');
            room_member_list.innerHTML = '';
            for (var item in room_memberName_list) {
                room_member_list.innerHTML += '<li id="' + room_memberId_list[item] + '" class="list-group-item">' + room_memberName_list[item] + '</li>';
            }
        });
        this.socket.on('myexitroom', function (room) {
            _this.socket.emit('someoneexitroom', room);
        });
        this.socket.on('dice_result', function (dice_rool, dice_rool_id) {
            var room_member = document.getElementById(dice_rool_id);
            room_member.innerHTML += dice_rool;
        });
        this.socket.on("disconnect", function (message) {
            console.log("disconnect " + message);
            location.reload();
        });
    }
    Client.prototype.exitRoom = function () {
        $("#dice_room").fadeOut(100);
        $("#home_page").delay(100).fadeIn(100);
        this.socket.emit('exitroom', this.socket.id);
    };
    Client.prototype.showPanel = function (id) {
        switch (id) {
            case 0:
                $("#dice_room").fadeOut(100);
                $("#home_page").delay(100).fadeIn(100);
                break;
            case 1:
                $("#home_page").fadeOut(100);
                $("#dice_room").delay(100).fadeIn(100);
                break;
        }
    };
    Client.prototype.joinRoom = function () {
        var username = $("#myusername").val();
        var roomname = $("#myroomname").val();
        var room_name = document.getElementById('showroomname');
        if (username.toString().length > 0 && roomname.toString().length > 0) {
            this.socket.emit("joinroom", username, roomname);
            console.log(username + ' join ' + roomname);
            room_name.innerText = "Room Name : " + roomname;
        }
    };
    Client.prototype.test = function () {
        this.socket.emit("dice_test", this.socket.id);
    };
    return Client;
}());
var client = new Client();
