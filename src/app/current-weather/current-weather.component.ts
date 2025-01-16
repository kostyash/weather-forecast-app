import { Component, inject, Input, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MeteoService } from '../meteo.service';
import { GeolocationService } from '../geolocation.service';
import { switchMap } from 'rxjs';
import { CurrentWeather } from '../contracts';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-current-weather',
  imports: [JsonPipe],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss'
})
export class CurrentWeatherComponent {

  @Input() weather!: CurrentWeather;


  ngOnInit(): void {

    
  }
}
