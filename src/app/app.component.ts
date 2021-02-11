import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../app/service/weather.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from '../environments/environment';
import * as mapboxgl from 'mapbox-gl'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  form: FormGroup;
  weather;
  humidity;  
  pressure;  
  temperature; 
  description;  
  temperatureMax;
  temperatureMin;
  feelsLike;
  toCelsius:number = 273.15;
  lat;
  lon;
  city;
  map:mapboxgl.Map;

  constructor(private wheaterService:WeatherService, private formBuilder:FormBuilder){
  }

  ngOnInit(){
    this.buildForm();
    this.mapBox('-77.483', '37.7501');
    this.marker('-77.483', '37.7501');
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      city: ['', [Validators.required]],
      country : ['',[Validators.required]]
    });
  }

  search(event:Event){
    event.preventDefault();
    if(this.form.valid){
      const value = this.form.value;
      this.getWeather(value.city,value.country)
    }else{
      this.form.markAllAsTouched();
    }
  }

  get cityField(){
    return this.form.get('city');
  }

  get countryField(){
    return this.form.get('country');
  }

  getWeather(city:string,country:string){
    this.wheaterService.getWeather(city,country).subscribe(
      value => {
        this.weather        = value
        this.temperature    = Number(this.weather.main.temp) - this.toCelsius;
        this.temperatureMax = this.weather.main.temp_max     - this.toCelsius;
        this.temperatureMin = this.weather.main.temp_min     - this.toCelsius;
        this.feelsLike      = this.weather.main.feels_like   - this.toCelsius;
        this.pressure       = this.weather.main.pressure;
        this.description    = this.weather.weather[0].description;
        this.humidity       = this.weather.main.humidity;
        this.lat            = this.weather.coord.lat;
        this.lon            = this.weather.coord.lon;
        this.city           = this.weather.name;
        this.mapBox(this.lon,this.lat);
        this.marker(this.lon,this.lat);
      },
        err => {
          alert('404 - Not Found')
          console.log(err)
        }
    )
  }

  mapBox(lon,lat){
  mapboxgl.accessToken = 'pk.eyJ1Ijoic3lkYmFycmV0dCIsImEiOiJja2t5M2M3Y3IxdWVvMnZwaDA4MWhzMjlqIn0.KjT_FAuCADC9UH0ZyFwzlQ';
    this.map = new mapboxgl.Map({
    container: 'map-mapbox',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [Number(lon),Number(lat)], // lon and lat
    zoom: 11
    });
  }

  marker(lon,lat){
  const marker = new mapboxgl.Marker({
  color: "red",
  draggable: false
  }).setLngLat([Number(lon), Number(lat)])
  .addTo(this.map);
  }

}
