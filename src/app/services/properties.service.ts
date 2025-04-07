import { Injectable } from '@angular/core';
import { PropertiesFilter } from '../models/PropertiesFIlter';
import { AuthService } from './auth.service';
import axios from 'axios';
import { PropertyTileModel } from '../models/PropertyTileModel';
import { PropertyModel } from '../models/PropertyModel';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  private baseUrl : string
  private authService :AuthService
  constructor(url : string, authService: AuthService) {
    this.baseUrl = `${url}/properties`
    this.authService  = authService
  }


  async getProperties(filter: PropertiesFilter) : Promise<[Array<PropertyTileModel> | null, string | null]>{
    const response = await  this.authService.doAuthHTTPCall<Array<PropertyTileModel>>(async()=>{
      return axios.get(`${this.baseUrl}`, {
        params: filter,
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }

  async getFullProperty(propId:string) : Promise<[PropertyModel | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<PropertyModel>(async()=>{
      return axios.get(`${this.baseUrl}/${propId}`, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }
}
