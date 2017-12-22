import { Station } from "./station";


export class Genre{

    private id:string
    private name:string
    private stations:Station[]

    constructor(id:string,name:string,stations?:Station[]){
        this.id = id
        this.name = name
        this.stations = stations
    }

    getID():string{
        return this.id
    }

    
    public getName() : string {
        return this.name
    }

    
    public getstations() : Station[]{
        return this.stations
    }

    
    public stationsCount() : number {
        return this.stations.length
    }
    
    
    
}