import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { toLoadingStateStream } from '../loading-state-utils';
import { MeteoService } from '../meteo.service';
import { selectCity } from '../state/selectors';

@Component({
  selector: 'app-current-weather-container',
  imports: [RouterLink, CurrentWeatherComponent, AsyncPipe, MatProgressSpinnerModule],
  templateUrl: './current-weather-container.component.html',
  styleUrl: './current-weather-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentWeatherContainerComponent {
  private meteoService = inject(MeteoService);
  private store = inject(Store);

  weather$ = this.store.select(selectCity).pipe(
    switchMap(city => toLoadingStateStream(this.meteoService.getCurrentWeatherByCity(city)))
  );
}
