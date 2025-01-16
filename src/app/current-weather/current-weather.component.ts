import { Component, Input } from '@angular/core';
import { CurrentWeather } from '../contracts';

@Component({
  selector: 'app-current-weather',
  imports: [],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss'
})
export class CurrentWeatherComponent {

  @Input() weather!: CurrentWeather;


  ngOnInit(): void {

    
  }
}
