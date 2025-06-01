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
    const payload: { year: number; month?: number } = { 
      year: year
    }
    if(month !== -1){
      payload.month = month+1
    }
    const response = await this.authService.doAuthHTTPCall<Array<ScheduleModel>>(async()=>{
      return axios.get(`${this.baseUrl}/properties/${propertyId}/schedules`, {
        params: payload,
        headers: this.authService.getAuthHeader()
      })
    })
    console.log("RESPONSE FROM SECHEDULES")
    console.log(response)
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]

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
    const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.post(`${this.baseUrl}/properties/${propertyId}/requests`, rentalRequest, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]

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
