export class OwnerRentalRequestModel {
    constructor(
        public id: string,
        public propertyId: string,
        public userId: string,
        public userName: string,
        public propertyName: string,
        public startDate: string,
        public endDate: string,
        public requestedAt: string,
        public status: string,
        public price: number
    ) {}
}
  