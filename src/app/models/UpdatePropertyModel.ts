export class UpdatePropertyDTO {
    constructor(
        public name?: string,
        public department?: string,
        public enterType?: string,
        public description?: string,
        public numberRooms?: number,
        public numberBathrooms?: number,
        public isPetFriendly?: boolean,
        public hasPool?: boolean,
        public hasAsador?: boolean,
        public nightPrice?: number
    ) {}
}
