export default class User{
    private _socketId:string
    private _userName:string
    private _joinedroomName:string
    private _diceRoll:number[]

    constructor(socketId:string,userName:string,joinedroomName:string) {
        this._socketId = socketId
        this._userName = userName
        this._joinedroomName = joinedroomName
        this._diceRoll = [null]
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
    public get diceRoll(): number{
        return this.diceRoll[0]
    }
    
    public set diceRoll(dice_result:number){
        this._diceRoll.unshift(dice_result)
    }

    public Go_dice(dice:number,num:number) {
        var result:number = 0
        for(var i = 0; i<dice; i++){
            result += Math.ceil(Math.random()*num);
        }
        return result
    }

}