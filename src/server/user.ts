export default class User{
    private _socketId:string
    private _userName:string
    private _joinedroomName:string

    constructor(socketId:string,userName:string,joinedroomName:string) {
        this._socketId = socketId
        this._userName = userName
        this._joinedroomName = joinedroomName
    }

    public get userName(): string {
        return this._userName
    }
    public get socketId(): string {
        return this._socketId
    }
    public get joinedroomName(): string {
        return this._joinedroomName
    }

}