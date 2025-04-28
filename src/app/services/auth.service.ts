import { Inject, Injectable } from '@angular/core';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { AccountModel } from '../models/AccountModel';
import { getErrorMessage, spanishErrorMessages } from '../errors/errors-map';
import { ApiResult, handleApiCall } from '../utils/service-helper';
import { TokenModel } from '../models/TokenModel';
import { StorageService } from './storage.service';
import { LoginModel } from '../models/LoginModel';
import { BASE_URL } from '../tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl : string
  private refreshToken : string | null = null
  private accessToken : string | null = null
  private storageService : StorageService
  public landlordRole : boolean = true


  constructor(@Inject(BASE_URL) url: string, storageService : StorageService) {
    this.baseUrl = `${url}/auth`
    this.storageService = storageService
    storageService.retrieve('refreshToken').then((value)=>{
      this.refreshToken = value
    })
  }

  async registerAccount(account : AccountModel): Promise<[string | null, string | null]>{
    const response = await handleApiCall<string>(async()=>{
      return await axios.post(`${this.baseUrl}/accounts`, account)
    })
    return [response.data, response.error]
  }

  async activateAccount(token : string): Promise<[string | null, string | null]>{
    const response = await handleApiCall<TokenModel>(async()=>{
      return await axios.post(`${this.baseUrl}/accounts/activate`, {code: token})
    })
    if(response.error){
      return [null, response.error]
    }
    this.storageService.store('refreshToken', response.data!.refreshToken)
    this.refreshToken = response.data!.refreshToken
    this.accessToken = response.data!.accessToken
    this.landlordRole = response.data!.role === 'LANDLORD'
    return ["SUCCESS", null]    
  }

  async loginAccount(loginModel: LoginModel): Promise<[string | null, string | null]>{
    const response = await handleApiCall<TokenModel>(async()=>{
      return await axios.post(`${this.baseUrl}/sessions`, loginModel)
    })
    if(response.error){
      return [null, response.error]
    }
    this.storageService.store('refreshToken', response.data!.refreshToken)
    this.refreshToken = response.data!.refreshToken
    this.accessToken = response.data!.accessToken
    this.landlordRole = response.data!.role === 'LANDLORD'
    return ["SUCCESS", null]
  }

  async refreshSession(): Promise<[string | null, string | null]>{
    const response = await handleApiCall<TokenModel>(async()=>{
      return await axios.post(`${this.baseUrl}/refresh`, {refreshToken: this.refreshToken})
    })
    if(response.error){
      this.refreshToken = null 
      this.storageService.delete('refreshToken')
      this.accessToken = null
      return [null, response.error]
    }
    this.accessToken = response.data!.accessToken
    return [response.data!.accessToken, null]
  }

  //this function is a wrapper on the basic doHttpCall function (which is by its own a wrapper)
  //what it does is that it validates if the error is expired token, and if it's, then it gets a new one
  async doAuthHTTPCall<T>(callback: ()=> Promise<AxiosResponse<T>>): Promise<ApiResult<T>>{
    let response = await handleApiCall<T>(callback)
    if(response.error === getErrorMessage('EXPIRED_TOKEN')){
      //if the access token was expired, then we refresh session and retry
      this.refreshSession()
      response = await handleApiCall(callback)
    }
    return response
  }


  getAuthHeader(): {[key:string] : string}{
    return {
      'Authorization' : `Bearer ${this.accessToken}` 
    }
  }


  logout(){
    this.storageService.delete('refreshToken')
  }
}
