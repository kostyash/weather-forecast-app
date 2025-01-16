import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, delay, map, Observable, of, switchMap } from 'rxjs';
import { CurrentWeather, Forecast } from './contracts';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  readonly API_KEY = '2e27373ae895408b87b175243251501';

  readonly baseUrl = `http://api.weatherapi.com/v1`;

  readonly forecastDays = 3;

  constructor(private http: HttpClient, private geolocationService: GeolocationService) { }

  getForeCastByCity(city: string): Observable<Forecast> {
    return (city ? of(city) : this.geolocationService.getGeoLocation().pipe(map(location => `${location.latitude},${location.longitude}`)))
      .pipe(switchMap(location => this.http.get(`${this.baseUrl}/forecast.json?q=${location}&days=${this.forecastDays}&key=${this.API_KEY}`)), delay(500),
        map((res: any) => this.transformToForecastWeather(res)));
  }

  getCurrentWeatherByCity(city: string): Observable<CurrentWeather> {

    return (city ? of(city) : this.geolocationService.getGeoLocation().pipe(map(location => `${location.latitude},${location.longitude}`)))
    .pipe(switchMap(location => this.http.get(`${this.baseUrl}/current.json?q=${location}&key=${this.API_KEY}`)), delay(500),
      map((res: any) => this.transformToCurrentWeather(res)));
  }

  private transformToCurrentWeather(res: any): CurrentWeather {
    return {
      date: res.location.localtime,
      location: `${res.location.name}`,
      desc: `${res.location.region} ${res.location.country}`,
      condition: res.current.condition.text,
      image: res.current.condition.icon,
      humidity: res.current.humidity,
      temperature: Math.round(res.current.temp_c)
    }
  }

  private transformToForecastWeather(res: any): Forecast {
    let forecast: Forecast = {
      location: `${res.location.name} ${res.location.region} ${res.location.country}`,
      days: []
    }
    res.forecast.forecastday.forEach((day: any) =>
      forecast.days.push({
        date: day.date,
        condition: day.day.condition.text,
        image: day.day.condition.icon,
        minTemperature: Math.round(day.day.mintemp_c),
        maxTemperature: Math.round(day.day.maxtemp_c)       
      })
    )
    return forecast;
  }
}
