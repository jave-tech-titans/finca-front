import { Inject, Injectable } from '@angular/core';
import { PropertiesFilter } from '../models/PropertiesFIlter';
import { AuthService } from './auth.service';
import axios from 'axios';
import { PropertyTileModel } from '../models/PropertyTileModel';
import { PropertyModel } from '../models/PropertyModel';
import { BASE_URL } from '../tokens';
import { UpdatePropertyDTO } from '../models/UpdatePropertyModel';

@Injectable({
  providedIn: 'root'
})
export class PropertiesService {

  private baseUrl : string
  private authService :AuthService
  
  constructor(@Inject(BASE_URL) url : string, authService: AuthService) {
    this.baseUrl = `${url}/properties`
    this.authService  = authService
  }

  async getDepartments() : Promise<[Array<string> | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<Array<string>>(async()=>{
      return axios.get(`${this.baseUrl}/departments`, {
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

  async getMyProperties(page: number) : Promise<[Array<PropertyTileModel> | null, string | null]>{
    const reponse = await this.authService.doAuthHTTPCall<Array<PropertyTileModel>>(async()=>{
      return axios.get(`${this.baseUrl}/mine`, {
        params: {
          page: page
        },
        headers: this.authService.getAuthHeader()
      })
    })
    if(reponse.error){
      return [null, reponse.error]
    }
    return [reponse.data!, null]
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


  async updateProperty(property: UpdatePropertyDTO, id: string) : Promise<[string | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.put(`${this.baseUrl}/${id}`, property, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }


  async uploadPicture(picture: File, propertyid: string) : Promise<[string | null, string | null]>{
    const formData = new FormData()
    formData.append('picture', picture)
    const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.post(`${this.baseUrl}/${propertyid}/pictures`, formData, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }

  async deactivateProperty(propertyId: string) : Promise<[string | null, string | null]>{
    const response = await this.authService.doAuthHTTPCall<string>(async()=>{
      return axios.delete(`${this.baseUrl}/${propertyId}`, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]
  }
}
