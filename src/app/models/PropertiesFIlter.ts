export class PropertiesFilter{
    constructor(
        public name:string | null,
        public department:string | null,
        public minPrice: number | null,
        public maxPrice: number | null,
        public nRooms: number | null,
        public nPeople: number | null,
        public page : number | null
    ){}
}