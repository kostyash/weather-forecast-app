import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MeteoService } from '../meteo.service';
import { GeolocationService } from '../geolocation.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-weather-today',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './weather-today.component.html',
  styleUrl: './weather-today.component.scss'
})
export class WeatherTodayComponent {

  meteoService = inject(MeteoService);
  geolocationService = inject(GeolocationService);


  ngOnInit(): void {

    this.geolocationService.getGeoLocation()
      .pipe(switchMap(location => this.meteoService.getCurrentWeatherByCity(`${location.latitude},${location.longitude}`)))
      .subscribe(console.log);
  }
}
