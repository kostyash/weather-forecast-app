import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { MeteoService } from '../meteo.service';
import { selectCity } from '../state/selectors';
import { CurrentWeatherComponent} from '../current-weather/current-weather.component';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-current-weather-container',
  imports: [RouterLink, RouterLinkActive, CurrentWeatherComponent, NgIf, AsyncPipe],
  templateUrl: './current-weather-container.component.html',
  styleUrl: './current-weather-container.component.scss'
})
export class CurrentWeatherContainerComponent {
  meteoService = inject(MeteoService);
  store = inject(Store);

  weather$ =  this.store.select(selectCity)
  .pipe(switchMap(location => this.meteoService.getCurrentWeatherByCity(location)));

  
}
