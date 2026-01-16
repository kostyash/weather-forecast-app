import { Routes } from '@angular/router';
import { CurrentWeatherContainerComponent } from './current-weather-container/current-weather-container.component';

export const routes: Routes = [
    {
        path: '',
        component: CurrentWeatherContainerComponent,
      },
      {
        path: 'forecast',
        loadComponent: () => import('./weather-forecast-container/weather-forecast-container.component').then(m => m.WeatherForecastContainerComponent),
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      }
];
