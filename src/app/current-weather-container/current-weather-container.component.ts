import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs';
import { CurrentWeatherComponent } from '../current-weather/current-weather.component';
import { toLoadingStateStream } from '../loading-state-utils';
import { MeteoService } from '../meteo.service';
import { selectCity } from '../state/selectors';

@Component({
  selector: 'app-current-weather-container',
  imports: [RouterLink, RouterLinkActive, CurrentWeatherComponent, AsyncPipe, MatProgressSpinnerModule, MatCardModule, MatButtonModule],
  templateUrl: './current-weather-container.component.html',
  styleUrl: './current-weather-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentWeatherContainerComponent {
  meteoService = inject(MeteoService);
  store = inject(Store);

  weather$ = this.store.select(selectCity)
    .pipe(switchMap(location => toLoadingStateStream(this.meteoService.getCurrentWeatherByCity(location))));


}
