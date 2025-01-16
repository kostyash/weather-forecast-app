import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { toLoadingStateStream } from '../loading-state-utils';
import { MeteoService } from '../meteo.service';
import { selectCity } from '../state/selectors';
import { WeatherForecastComponent } from '../weather-forecast/weather-forecast.component';

@Component({
  selector: 'app-weather-forecast-container',
  imports: [RouterLink, RouterLinkActive, WeatherForecastComponent, AsyncPipe, MatProgressSpinnerModule, MatCardModule, MatButtonModule],
  templateUrl: './weather-forecast-container.component.html',
  styleUrl: './weather-forecast-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherForecastContainerComponent {
  meteoService = inject(MeteoService);
  store = inject(Store);

  forecast$ = this.store.select(selectCity)
    .pipe(switchMap(location => toLoadingStateStream(this.meteoService.getForeCastByCity(location))));


}