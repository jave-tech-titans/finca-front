export class RentalRequestModel {
    constructor(
        public id: string,
        public propertyId: string,
        public propertyName: string,
        public startDate: string,
        public endDate: string,
        public status: string,
        public requestedAt: string,
        public price: number
    ) {}
}
  