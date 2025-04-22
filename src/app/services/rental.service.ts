import { Inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BASE_URL } from '../tokens';
import { ScheduleModel } from '../models/ScheduleModel';
import axios from 'axios';
import { OwnerRentalRequestModel } from '../models/OnwerRentalRequestModel';
import { RentalRequestModel } from '../models/RentalRequestModel';
import { CreateRentalRequestModel } from '../models/CreateRentalRequestModel';
import { CreateRatingModel } from '../models/CreateRatingModel';

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  
  private baseUrl : string
  private authService :AuthService
  
  constructor(@Inject(BASE_URL) url : string, authService: AuthService) {
    this.baseUrl = `${url}/rental`
    this.authService  = authService
  }

  async getPropertySchedules(propertyId: string, year:number, month:number): Promise<[Array<ScheduleModel> | null, string | null]>{
    /*const response = await this.authService.doAuthHTTPCall<Array<ScheduleModel>>(async()=>{
      return axios.get(`${this.baseUrl}/${propertyId}/schedules`, {
        params: {
          year: year,
          month: month
        },
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]*/
    const mockSchedules: ScheduleModel[] = [
      new ScheduleModel('2025-01-10', '2025-01-15'),
      new ScheduleModel('2025-01-20', '2025-01-22'),
      new ScheduleModel('2025-03-05', '2025-03-10'),
      new ScheduleModel('2025-04-12', '2025-04-18'),
      new ScheduleModel('2025-04-25', '2025-04-28'),
      new ScheduleModel('2025-06-01', '2025-06-03'),
      new ScheduleModel('2025-12-20', '2025-12-31')
    ];
  
    // Simulate small delay
    await new Promise(res => setTimeout(res, 300));
  
    // 🔍 Filter by year
    const filteredByYear = mockSchedules.filter(s => {
      return new Date(s.startDate).getFullYear() === year;
    });
  
    // 🔍 If a month is provided (not -1 or null), filter by month
    const finalFiltered = month !== -1 && month !== null
      ? filteredByYear.filter(s => new Date(s.startDate).getMonth() === month)
      : filteredByYear;
  
    return [finalFiltered, null];
  }

  async getOwnerRentalRequests(page: number): Promise<[Array<OwnerRentalRequestModel> | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<Array<OwnerRentalRequestModel>>(async()=>{
      return axios.get(`${this.baseUrl}/owner/requests`, {
        params: {
          page: page
        },
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }


  async getUserRentalRequests(page: number): Promise<[Array<RentalRequestModel> | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<Array<RentalRequestModel>>(async()=>{
      return axios.get(`${this.baseUrl}/requests`, {
        params: {
          page: page
        },
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }

  async acceptRentalRequest(requestId: string): Promise<[string | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.patch(`${this.baseUrl}/${requestId}/accept`, null, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }

  async cancelRentalRequest(requestId: string): Promise<[string | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.patch(`${this.baseUrl}/${requestId}/deny`, null, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }

  async createRentalRequest(propertyId: string, rentalRequest: CreateRentalRequestModel): Promise<[string | null, string | null]>{
    /*const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.post(`${this.baseUrl}/${propertyId}/requests`, rentalRequest, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]*/
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!rentalRequest.startDate || !rentalRequest.endDate || !rentalRequest.nGuests) {
      return [null, "Missing required rental request data."];
    }
    const mockRequestId = `mock-request-${Date.now()}`;
    return [mockRequestId, null];
  }

  async createRating(requestId: string, ratingModel: CreateRatingModel) : Promise<[string | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.post(`${this.baseUrl}/requests/${requestId}/ratings`, ratingModel, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }
}
