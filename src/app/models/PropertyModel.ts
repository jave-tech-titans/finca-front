export class PropertyModel{
    constructor(
        public id:string,
        public name:string,
        public department:string,
        public description:string,
        public enterType:string,
        public hasAsador: boolean,
        public hasPool: boolean,
        public isPetFriendly:boolean,
        public numberBathrooms:number,
        public numberRooms:number,
        public nightPrice : number,
        public ownerId: string,
        public rating:number,
        public pictures:Array<string>
    ){}
}