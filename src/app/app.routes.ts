import { Routes } from '@angular/router';
import { CurrentWeatherContainerComponent } from './current-weather-container/current-weather-container.component';
import { WeatherForecastContainerComponent } from './weather-forecast-container/weather-forecast-container.component';

export const routes: Routes = [
    {
        path: '',
        component: CurrentWeatherContainerComponent,
      },
      {
        path: 'forecast',
        component: WeatherForecastContainerComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      }
];
