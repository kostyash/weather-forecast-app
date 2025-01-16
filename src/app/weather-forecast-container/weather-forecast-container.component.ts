import { Component, inject } from '@angular/core';
import { MeteoService } from '../meteo.service';
import { selectCity } from '../state/selectors';
import { switchMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WeatherForecastComponent } from '../weather-forecast/weather-forecast.component';
import { AsyncPipe, NgIf } from '@angular/common';
import { toLoadingStateStream } from '../loading-state-utils';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-weather-forecast-container',
  imports: [RouterLink, RouterLinkActive, WeatherForecastComponent, AsyncPipe, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './weather-forecast-container.component.html',
  styleUrl: './weather-forecast-container.component.scss'
})
export class WeatherForecastContainerComponent {
  meteoService = inject(MeteoService);
  store = inject(Store);

  forecast$ = this.store.select(selectCity)
  .pipe(switchMap(location => toLoadingStateStream(this.meteoService.getForeCastByCity(location))));

 
}