import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MeteoService } from '../meteo.service';

@Component({
  selector: 'app-weather-today',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './weather-today.component.html',
  styleUrl: './weather-today.component.scss'
})
export class WeatherTodayComponent  {

  meteoService = inject(MeteoService);
 

  ngOnInit(): void {
    this.meteoService.getCurrentWeatherByCity().subscribe(console.log);
  }

  
}
