import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  apiKey:string = '1a672f6d7425ab40084bb8c4a53d8c53';
  URI:string;


  constructor(private http:HttpClient) {
    this.URI ='https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=';
   // this.URI ='http://api.openweathermap.org/data/2.5/weather?q=';

   }

  public getWeather(cityName:string,countryName:string){
    return this.http.get(this.URI + `${cityName},${countryName}&appid=${this.apiKey}`);
  }
  
}
