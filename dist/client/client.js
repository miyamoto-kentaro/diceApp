var Client = /** @class */ (function () {
    function Client() {
        this.socket = io();
        this.socket.on("connect", function () {
            console.log("connect");
        });
        this.socket.on("disconnect", function (message) {
            console.log("disconnect " + message);
            location.reload();
        });
    }
    return Client;
}());
var client = new Client();
