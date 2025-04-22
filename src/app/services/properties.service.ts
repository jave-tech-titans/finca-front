import { Inject, Injectable } from '@angular/core';
import { PropertiesFilter } from '../models/PropertiesFIlter';
import { AuthService } from './auth.service';
import axios from 'axios';
import { PropertyTileModel } from '../models/PropertyTileModel';
import { PropertyModel } from '../models/PropertyModel';
import { BASE_URL } from '../tokens';
import { UpdatePropertyDTO } from '../models/UpdatePropertyModel';
import { mock } from 'node:test';

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
    /*const response = await this.authService.doAuthHTTPCall<PropertyModel>(async()=>{
      return axios.get(`${this.baseUrl}/${propId}`, {
        headers: this.authService.getAuthHeader()
      })
    })
    if(response.error){
      return [null, response.error]
    }
    return [response.data!, null]*/
    await new Promise(resolve => setTimeout(resolve, 50));
    const mockProperty = new PropertyModel(
      propId,                        
      `Mock Property: ${propId}`,    
      'Antioquia Mock Department',   
      'A detailed description of this wonderful mock property. It has great views and amenities.', 
      'Self Check-in',               
      true,                          
      true,                          
      false,                         
      3,                             
      4,                             
      275,                           
      'mock-owner-xyz',              
      4.7,                           
      [                              
        'https://multimedia.metrocuadrado.com/17914-M5353834/17914-M5353834_1_x.jpg',
        'https://a.storyblok.com/f/160385/ffc3e05901/finca_colombia.jpg/m/?w=256&q=100',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaARc3rlcMsXfV6bT0jdwP8h6CwKgkbCj-Qw&s'
      ]
    );
    return [mockProperty, null];
  }

  async getMyProperties(page: number) : Promise<[Array<PropertyTileModel> | null, string | null]>{
    /*const reponse = await this.authService.doAuthHTTPCall<Array<PropertyTileModel>>(async()=>{
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
    return [reponse.data!, null]*/
    await new Promise(resolve => setTimeout(resolve, 50));
    return [this.getMockPropertiesTiles(), null];
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
    await new Promise(resolve => setTimeout(resolve, 50));
    return [this.getMockPropertiesTiles(), null];
  }

  getMockPropertiesTiles(): Array<PropertyTileModel>{
    var mockProperties: PropertyTileModel[] = [
      new PropertyTileModel(
        'mock-tile-001',         
        'Mock Lakeside Cabin',   
        'Antioquia',             
        3,                       
        6,                       
        195,                     
        4.6,                     
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/163102645.jpg?k=1c8623aaae7daa6149ce95f46f06cc71e9d10af4bd731d2d21dfb3c28380099a&o=&hp=1'
      ),
      new PropertyTileModel(
        'mock-tile-002',
        'Mock Mountain Retreat',
        'Cundinamarca',
        4,
        8,
        280,
        4.9,
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/163102645.jpg?k=1c8623aaae7daa6149ce95f46f06cc71e9d10af4bd731d2d21dfb3c28380099a&o=&hp=1'
      ),
      new PropertyTileModel(
        'mock-tile-003',
        'Mock Coffee Finca',
        'Risaralda',
        5,
        10,
        320,
        4.7,
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/163102645.jpg?k=1c8623aaae7daa6149ce95f46f06cc71e9d10af4bd731d2d21dfb3c28380099a&o=&hp=1'
      ),
      new PropertyTileModel(
        'mock-tile-004',
        'Mock Beach Bungalow',
        'Magdalena',
        2,
        4,
        210,
        4.3,
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/163102645.jpg?k=1c8623aaae7daa6149ce95f46f06cc71e9d10af4bd731d2d21dfb3c28380099a&o=&hp=1'
      ),
      new PropertyTileModel(
        'mock-tile-005',
        'Mock Urban Apartment',
        'Valle del Cauca',
        1,
        2,
        110,
        4.0,
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/163102645.jpg?k=1c8623aaae7daa6149ce95f46f06cc71e9d10af4bd731d2d21dfb3c28380099a&o=&hp=1'
      ),
      new PropertyTileModel(
        'mock-tile-006',
        'Mock Countryside Villa',
        'Boyacá',
        6,
        12,
        450,
        4.8,
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/163102645.jpg?k=1c8623aaae7daa6149ce95f46f06cc71e9d10af4bd731d2d21dfb3c28380099a&o=&hp=1'
      ),
    ];
    mockProperties = [...mockProperties, ...mockProperties, ...mockProperties]
    return mockProperties
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
