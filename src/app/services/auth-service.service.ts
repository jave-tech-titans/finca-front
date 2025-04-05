import { Injectable } from '@angular/core';
import axios from 'axios';
import { Account } from '../models/Account';
import { getErrorMessage } from '../errors/errors-map';
import { handleApiCall } from '../utils/service-helper';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private baseUrl : string
  constructor(url: string) {
    this.baseUrl = url
  }

  async registerAccount(account : Account): Promise<[string | null, string | null]>{
    const response = await handleApiCall(async()=>{
      return await axios.post(`${this.baseUrl}/api/v1/auth/accounts`, account)
    })
    return [response.data, response.error]
  }
}
