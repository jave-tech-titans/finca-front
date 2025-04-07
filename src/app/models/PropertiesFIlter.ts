export class PropertiesFilter{
    constructor(
        public name:string,
        public department:string,
        public minPrice: number,
        public maxPrice: number,
        public nRooms: number,
        public nPeople: number,
        public page : number
    ){}
}