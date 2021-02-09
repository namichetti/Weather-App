import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../app/service/weather.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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

  constructor(private wheaterService:WeatherService, private formBuilder:FormBuilder){
  }

  ngOnInit(){
    this.buildForm();
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
      console.log(value.city + ' y ' + value.country)
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
        this.humidity       = this.weather.main.humidity
        console.log(this.weather)
      },
        err => {
          console.log(err)
        }
    )
  }

}
