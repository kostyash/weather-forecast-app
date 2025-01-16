import { Component, Input } from '@angular/core';
import { Forecast } from '../contracts';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-weather-forecast',
  imports: [JsonPipe],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss'
})
export class WeatherForecastComponent {

  @Input() forecast!: Forecast;

}
