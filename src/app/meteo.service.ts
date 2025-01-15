import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CurrentWeather, Forecast } from './contracts';

@Injectable({
  providedIn: 'root'
})
export class MeteoService {

  readonly API_KEY = '2e27373ae895408b87b175243251501';

  readonly baseUrl = `http://api.weatherapi.com/v1`;

  readonly forecastDays = 3;

  constructor(private http: HttpClient) { }

  getForeCastByCity(city: string = ''): Observable<Forecast> {
    const location = city || 'petah tikwa' || '42.3478,-71.0466';
    return this.http.get(`${this.baseUrl}/forecast.json?q=${location}&days=${this.forecastDays}&key=${this.API_KEY}`)
    .pipe(map((res: any) => this.transformToForecastWeather(res)));
  }

  getCurrentWeatherByCity(city: string): Observable<CurrentWeather> {   
    return this.http.get(`${this.baseUrl}/current.json?q=${city}&key=${this.API_KEY}`)
      .pipe(map((res: any) => this.transformToCurrentWeather(res)));
  }

  private transformToCurrentWeather(res: any): CurrentWeather {
    return {
      date: res.location.localtime,
      location: `${res.location.name} ${res.location.region} ${res.location.country}`,
      condition: res.current.condition.text,
      image: res.current.condition.icon,
      humidity: res.current.humidity,
      temperature: res.current.temp_c
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
        minTemperature: day.day.mintemp_c,
        maxTemperature: day.day.maxtemp_c
      })
    )
    return forecast;
  }
}
