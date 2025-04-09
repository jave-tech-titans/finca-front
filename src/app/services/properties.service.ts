import { Inject, Injectable } from '@angular/core';
import { PropertiesFilter } from '../models/PropertiesFIlter';
import { AuthService } from './auth.service';
import axios from 'axios';
import { PropertyTileModel } from '../models/PropertyTileModel';
import { PropertyModel } from '../models/PropertyModel';
import { BASE_URL } from '../tokens';

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


  async getProperties(filter: PropertiesFilter) : Promise<[Array<PropertyTileModel> | null, string | null]>{
    /*const response = await  this.authService.doAuthHTTPCall<Array<PropertyTileModel>>(async()=>{
      return axios.get(`${this.baseUrl}`, {
        params: filter,
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]*/
    return [[
      new PropertyTileModel('aa', 'Mi finca', 'Cundinamarca', 10, 20, 14.000, 4.65, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/19/08/27/finca-el-ocaso-salento.jpg?w=500&h=400&s=1'),
      new PropertyTileModel('aa', 'Mi finca', 'Cundinamarca', 10, 20, 14.000, 4.65, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/19/08/27/finca-el-ocaso-salento.jpg?w=500&h=400&s=1'),
      new PropertyTileModel('aa', 'Mi finca', 'Cundinamarca', 10, 20, 14.000, 4.65, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/19/08/27/finca-el-ocaso-salento.jpg?w=500&h=400&s=1'),
      new PropertyTileModel('aa', 'Mi finca', 'Cundinamarca', 10, 20, 14.000, 4.65, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/19/08/27/finca-el-ocaso-salento.jpg?w=500&h=400&s=1'),
      new PropertyTileModel('aa', 'Mi finca', 'Cundinamarca', 10, 20, 14.000, 4.65, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/19/08/27/finca-el-ocaso-salento.jpg?w=500&h=400&s=1'),
      new PropertyTileModel('aa', 'Mi finca', 'Cundinamarca', 10, 20, 14.000, 4.65, 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/19/08/27/finca-el-ocaso-salento.jpg?w=500&h=400&s=1')
    ], null]
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
