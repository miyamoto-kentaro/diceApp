"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(socketId, userName, joinedroomName) {
        this._socketId = socketId;
        this._userName = userName;
        this._joinedroomName = joinedroomName;
        this._diceRoll = [null];
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
    get diceRoll() {
        return this.diceRoll[0];
    }
    set diceRoll(dice_result) {
        this._diceRoll.unshift(dice_result);
    }
    Go_dice(dice, num) {
        var result = 0;
        for (var i = 0; i < dice; i++) {
            result += Math.ceil(Math.random() * num);
        }
        return result;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map