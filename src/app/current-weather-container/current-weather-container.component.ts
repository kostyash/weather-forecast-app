import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { toLoadingStateStream } from '../loading-state-utils';
import { MeteoService } from '../meteo.service';
import { selectCity } from '../state/selectors';

@Component({
  selector: 'app-current-weather-container',
  imports: [RouterLink, RouterLinkActive, CurrentWeatherComponent, AsyncPipe],
  templateUrl: './current-weather-container.component.html',
  styleUrl: './current-weather-container.component.scss'
})
export class CurrentWeatherContainerComponent {
  meteoService = inject(MeteoService);
  store = inject(Store);

  weather$ =  this.store.select(selectCity)
  .pipe(switchMap(location => toLoadingStateStream(this.meteoService.getCurrentWeatherByCity(location))));

  
}
