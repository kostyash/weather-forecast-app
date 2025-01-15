import { Routes } from '@angular/router';
import { WeatherTodayComponent } from './weather-today/weather-today.component';
import { WeatherForecastComponent } from './weather-forecast/weather-forecast.component';

export const routes: Routes = [
    {
        path: '',
        component: WeatherTodayComponent,
      },
      {
        path: 'forecast',
        component: WeatherForecastComponent,
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
      }
];
