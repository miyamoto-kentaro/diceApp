"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(socketId, userName, joinedroomName) {
        this._socketId = socketId;
        this._userName = userName;
        this._joinedroomName = joinedroomName;
    }
    get userName() {
        return this._userName;
    }
    get socketId() {
        return this._socketId;
    }
    get joinedroomName() {
        return this._joinedroomName;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map