export default class Room{
    private _roomName:string

    constructor(roomName) {
        this._roomName = roomName
    }

    public get roomName(): string {
        return this._roomName
    }

}