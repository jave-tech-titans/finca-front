import { Inject, Injectable } from '@angular/core';
import axios, { AxiosResponse } from 'axios';
import { AccountModel } from '../models/AccountModel';
import { getErrorMessage } from '../errors/errors-map';
import { ApiResult, handleApiCall } from '../utils/service-helper';
import { TokenModel } from '../models/TokenModel';
import { StorageService } from './storage.service';
import { LoginModel } from '../models/LoginModel';
import { BASE_URL } from '../tokens';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string
  private refreshToken: string | null = null
  private accessToken: string | null = null
  private storageService: StorageService
  public landlordRole: boolean = false

  constructor(@Inject(BASE_URL) url: string, storageService: StorageService) {
    this.baseUrl = `${url}/auth`
    this.storageService = storageService
    storageService.retrieve('refreshToken').then(value => {
      this.refreshToken = value
    })
    storageService.retrieve('accessToken').then(value => {
      this.accessToken = value
    })
  }

  registerAccount = async (account: AccountModel): Promise<[string | null, string | null]> => {
    const response = await handleApiCall<string>(async () => {
      return await axios.post(`${this.baseUrl}/accounts`, account)
    })
    return [response.data, response.error]
  }

  activateAccount = async (token: string): Promise<[string | null, string | null]> => {
    const response = await handleApiCall<TokenModel>(async () => {
      return await axios.post(`${this.baseUrl}/accounts/activate`, { code: token })
    })
    if (response.error) {
      return [null, response.error]
    }
    this.storageService.store('refreshToken', response.data!.refreshToken)
    this.storageService.store('accessToken', response.data!.accessToken)
    this.refreshToken = response.data!.refreshToken
    this.accessToken = response.data!.accessToken
    this.landlordRole = response.data!.role === 'LANDLORD'
    return ["SUCCESS", null]
  }

  loginAccount = async (loginModel: LoginModel): Promise<[string | null, string | null]> => {
    console.log("what?")
    const response = await handleApiCall<TokenModel>(async () => {
      return await axios.post(`${this.baseUrl}/sessions`, loginModel)
    })
    if (response.error) {
      console.log("in error")
      return [null, response.error]
    }
    console.log("hello?")
    this.storageService.store('refreshToken', response.data!.refreshToken)
    this.storageService.store('accessToken', response.data!.accessToken)
    this.refreshToken = response.data!.refreshToken
    this.accessToken = response.data!.accessToken
    this.landlordRole = response.data!.role === 'LANDLORD'
    console.log(`access is ${this.refreshToken}`)
    return ["SUCCESS", null]
  }

  refreshSession = async (): Promise<[string | null, string | null]> => {
    const response = await handleApiCall<TokenModel>(async () => {
      return await axios.post(`${this.baseUrl}/refresh`, { refreshToken: this.refreshToken })
    })
    if (response.error) {
      this.refreshToken = null
      this.storageService.delete('refreshToken')
      this.accessToken = null
      return [null, response.error]
    }
    this.accessToken = response.data!.accessToken
    this.storageService.store('accessToken', response.data!.accessToken)
    return [response.data!.accessToken, null]
  }

  doAuthHTTPCall = async <T>(callback: () => Promise<AxiosResponse<T>>): Promise<ApiResult<T>> => {
    let response = await handleApiCall<T>(callback)
    console.log(response)
    if (response.error === getErrorMessage('EXPIRED_TOKEN')) {
      console.log("REFRESHING ACCESS TOKEN")
      await this.refreshSession()
      response = await handleApiCall(callback)
    }
    return response
  }

  getAuthHeader = (): { [key: string]: string } => {
    return {
      'Authorization': `Bearer ${this.accessToken}`
    }
  }

  logout = (): void => {
    this.storageService.delete('refreshToken')
    this.storageService.delete('accessToken')
  }
}
