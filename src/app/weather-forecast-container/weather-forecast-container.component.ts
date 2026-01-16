import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { toLoadingStateStream } from '../loading-state-utils';
import { MeteoService } from '../meteo.service';
import { selectCity } from '../state/selectors';
import { WeatherForecastComponent } from '../weather-forecast/weather-forecast.component';

@Component({
  selector: 'app-weather-forecast-container',
  imports: [RouterLink, WeatherForecastComponent, AsyncPipe, MatProgressSpinnerModule],
  templateUrl: './weather-forecast-container.component.html',
  styleUrl: './weather-forecast-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherForecastContainerComponent {
  private meteoService = inject(MeteoService);
  private store = inject(Store);

  forecast$ = this.store.select(selectCity).pipe(
    switchMap(city => toLoadingStateStream(this.meteoService.getForeCastByCity(city)))
  );
}
