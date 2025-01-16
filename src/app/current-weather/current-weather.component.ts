import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrentWeather } from '../contracts';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-current-weather',
  imports: [MatCardModule],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentWeatherComponent {

  @Input() weather!: CurrentWeather;


  ngOnInit(): void {


  }
}
