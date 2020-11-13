var Client = /** @class */ (function () {
    function Client() {
        var _this = this;
        this.socket = io();
        this.socket.on("connect", function () {
            console.log("connect");
        });
        this.socket.on('myexitroom', function (room) {
            _this.socket.emit('someoneexitroom', room);
        });
        this.socket.on('reloadroom', function (room_memberName_list, room_memberId_list) {
            console.log(room_memberName_list);
            console.log(room_memberId_list);
            var room_member_list = document.getElementById('room_member_list');
            room_member_list.innerHTML = '';
            for (var item in room_memberName_list) {
                room_member_list.innerHTML += '<li id="' + room_memberId_list[item] + '" class="alert-dark p-2 bd-highlight member ">' + room_memberName_list[item] + '<a class="btn btn-primary roll">dice roll</a>' + '</li>';
            }
        });
        this.socket.on('dice_result', function (user, dice, number) {
            console.log(user._socketId);
            var room_member = document.getElementById(user._socketId);
            var roll = room_member.firstElementChild;
            roll.innerHTML = user._diceRoll[0] + ' [' + dice + 'D' + number + ']';
            var history = document.getElementById('history');
            // history.innerHTML += user._diceRoll + '[<a href="#" class="alert-link"' + ' onclick="client.goDice(' + dice + ',' + number + ')">' + dice + 'D' + number + '</a>], '
            history.insertAdjacentHTML('afterbegin', user._diceRoll[0] + '[<a href="#" class="alert-link"' + ' onclick="client.goDice(' + dice + ',' + number + ')">' + dice + 'D' + number + '</a>], ');
        });
        this.socket.on('room_member_disconnect', function (room) {
            _this.socket.emit('');
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
        $("#home_page").fadeOut(100);
        $("#dice_room").delay(100).fadeIn(100);
        var username = $("#myusername").val();
        var roomname = $("#myroomname").val();
        var room_name = document.getElementById('showroomname');
        if (username.toString().length > 0 && roomname.toString().length > 0) {
            this.socket.emit("joinroom", username, roomname);
            console.log(username + " join " + roomname);
            room_name.innerText = "Room Name : " + roomname;
        }
    };
    Client.prototype.goDice = function (dice, number) {
        if (dice == 0 || number == 0) {
            dice = Number($("#input_dice").val());
            number = Number($("#input_number").val());
        }
        console.log(dice + ' D ' + number);
        this.socket.emit("dice_roll", this.socket.id, dice, number);
    };
    return Client;
}());
var client = new Client();
