import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MeteoService } from '../meteo.service';

@Component({
  selector: 'app-weather-forecast',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './weather-forecast.component.html',
  styleUrl: './weather-forecast.component.scss'
})
export class WeatherForecastComponent {


  meteoService = inject(MeteoService);


  ngOnInit(): void {
    this.meteoService.getForeCastByCity().subscribe(console.log);
  }
}
