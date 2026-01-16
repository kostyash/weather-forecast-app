import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, of, switchMap } from 'rxjs';
import { CurrentWeather, DayForeCast, Forecast, LocationSuggestion } from './contracts';
import { GeolocationService } from './geolocation.service';

interface WeatherApiCurrentResponse {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    condition: { text: string; icon: string };
    humidity: number;
    temp_c: number;
    feelslike_c: number;
    wind_kph: number;
    wind_dir: string;
    pressure_mb: number;
    uv: number;
    vis_km: number;
    cloud: number;
  };
}

interface WeatherApiForecastResponse {
  location: {
    name: string;
    region: string;
    country: string;
  };
  forecast: {
    forecastday: {
      date: string;
      day: {
        condition: { text: string; icon: string };
        mintemp_c: number;
        maxtemp_c: number;
        daily_chance_of_rain: number;
        maxwind_kph: number;
        avghumidity: number;
        uv: number;
      };
    }[];
  };
}

interface WeatherApiSearchResult {
  name: string;
  region: string;
  country: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeteoService {
  private http = inject(HttpClient);
  private geolocationService = inject(GeolocationService);

  readonly API_KEY = '2e27373ae895408b87b175243251501';
  readonly baseUrl = `http://api.weatherapi.com/v1`;
  readonly forecastDays = 3;

  getForeCastByCity(city: string): Observable<Forecast> {
    return (city ? of(city) : this.geolocationService.getGeoLocation().pipe(map(location => `${location.latitude},${location.longitude}`)))
      .pipe(
        switchMap(location => this.http.get<WeatherApiForecastResponse>(`${this.baseUrl}/forecast.json?q=${location}&days=${this.forecastDays}&key=${this.API_KEY}`)),
        map(res => this.transformToForecastWeather(res))
      );
  }

  getCurrentWeatherByCity(city: string): Observable<CurrentWeather> {
    return (city ? of(city) : this.geolocationService.getGeoLocation().pipe(map(location => `${location.latitude},${location.longitude}`)))
      .pipe(
        switchMap(location => this.http.get<WeatherApiCurrentResponse>(`${this.baseUrl}/current.json?q=${location}&key=${this.API_KEY}`)),
        map(res => this.transformToCurrentWeather(res))
      );
  }

  searchLocations(query: string): Observable<LocationSuggestion[]> {
    if (!query || query.length < 2) {
      return of([]);
    }
    return this.http.get<WeatherApiSearchResult[]>(`${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&key=${this.API_KEY}`).pipe(
      map(results => results.map(r => ({
        name: r.name,
        region: r.region,
        country: r.country
      })))
    );
  }

  private transformToCurrentWeather(res: WeatherApiCurrentResponse): CurrentWeather {
    return {
      date: res.location.localtime,
      location: `${res.location.name}`,
      desc: `${res.location.region} ${res.location.country}`,
      condition: res.current.condition.text,
      image: res.current.condition.icon,
      humidity: res.current.humidity,
      temperature: Math.round(res.current.temp_c),
      feelsLike: Math.round(res.current.feelslike_c),
      windSpeed: Math.round(res.current.wind_kph),
      windDirection: res.current.wind_dir,
      pressure: Math.round(res.current.pressure_mb),
      uvIndex: res.current.uv,
      visibility: Math.round(res.current.vis_km),
      cloud: res.current.cloud
    };
  }

  private transformToForecastWeather(res: WeatherApiForecastResponse): Forecast {
    const days: DayForeCast[] = res.forecast.forecastday.map(day => ({
      date: day.date,
      condition: day.day.condition.text,
      image: day.day.condition.icon,
      minTemperature: Math.round(day.day.mintemp_c),
      maxTemperature: Math.round(day.day.maxtemp_c),
      chanceOfRain: day.day.daily_chance_of_rain,
      maxWind: Math.round(day.day.maxwind_kph),
      avgHumidity: Math.round(day.day.avghumidity),
      uvIndex: day.day.uv
    }));

    return {
      location: `${res.location.name} ${res.location.region} ${res.location.country}`,
      days
    };
  }
}
