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
  private role: string | null = null

  constructor(@Inject(BASE_URL) url: string, storageService: StorageService) {
    this.baseUrl = `${url}/auth`
    this.storageService = storageService
    
    // Initialize stored values
    Promise.all([
      storageService.retrieve('refreshToken'),
      storageService.retrieve('accessToken'),
      storageService.retrieve('role')
    ]).then(([refreshToken, accessToken, role]) => {
      this.refreshToken = refreshToken
      this.accessToken = accessToken
      this.role = role
    })
  }

  get isLandlord(): boolean {
    return this.role === 'LANDLORD'
  }

  private storeTokenAndRole(tokenModel: TokenModel): void {
    this.storageService.store('refreshToken', tokenModel.refreshToken)
    this.storageService.store('accessToken', tokenModel.accessToken)
    this.storageService.store('role', tokenModel.role)
    
    this.refreshToken = tokenModel.refreshToken
    this.accessToken = tokenModel.accessToken
    this.role = tokenModel.role
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
    
    this.storeTokenAndRole(response.data!)
    return ["SUCCESS", null]
  }

  loginAccount = async (loginModel: LoginModel): Promise<[string | null, string | null]> => {
    const response = await handleApiCall<TokenModel>(async () => {
      return await axios.post(`${this.baseUrl}/sessions`, loginModel)
    })
    if (response.error) {
      return [null, response.error]
    }

    this.storeTokenAndRole(response.data!)
    return ["SUCCESS", null]
  }

  refreshSession = async (): Promise<[string | null, string | null]> => {
    const response = await handleApiCall<TokenModel>(async () => {
      return await axios.post(`${this.baseUrl}/refresh`, { refreshToken: this.refreshToken })
    })
    if (response.error) {
      this.refreshToken = null
      this.accessToken = null
      this.role = null
      this.storageService.delete('refreshToken')
      this.storageService.delete('accessToken')
      this.storageService.delete('role')
      return [null, response.error]
    }
    
    this.accessToken = response.data!.accessToken
    this.storageService.store('accessToken', response.data!.accessToken)
    return [response.data!.accessToken, null]
  }

  doAuthHTTPCall = async <T>(callback: () => Promise<AxiosResponse<T>>): Promise<ApiResult<T>> => {
    let response = await handleApiCall<T>(callback)
    if (response.error === getErrorMessage('EXPIRED_TOKEN') || response.error === getErrorMessage('INVALID_TOKEN')) {
      console.log('Refreshing session')
      await this.refreshSession()
      console.log('Session refreshed, trying again with new token')
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
    this.storageService.delete('role')
    this.refreshToken = null
    this.accessToken = null
    this.role = null
  }
}
