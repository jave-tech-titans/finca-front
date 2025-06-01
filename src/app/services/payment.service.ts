import { Inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { BASE_URL } from '../tokens';
import axios from 'axios';
import { CreatePaymentModel } from '../models/CreatePaymentModel';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl : string
  private authService :AuthService
  
  constructor(@Inject(BASE_URL) url : string, authService: AuthService) {
    this.baseUrl = `${url}/payments`
    this.authService  = authService
  }

  async getBanks() : Promise<[Array<string> | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<Array<string>>(async()=>{
      return axios.get(`${this.baseUrl}/banks`, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }

  async paySchedule(requestId: string ,paymentModel:CreatePaymentModel): Promise<[string | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.post(`${this.baseUrl}/requests/${requestId}/payments`, paymentModel, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }
}
