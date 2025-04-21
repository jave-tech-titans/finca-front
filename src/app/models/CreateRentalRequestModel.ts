export class CreateRentalRequestModel {
    constructor(
      public startDate: string,
      public endDate: string,
      public nGuests: number
    ) {}
}
  