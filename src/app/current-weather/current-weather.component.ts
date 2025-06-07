import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CurrentWeather } from '../contracts';

@Component({
  selector: 'app-current-weather',
  imports: [MatCardModule],
  templateUrl: './current-weather.component.html',
  styleUrl: './current-weather.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentWeatherComponent {
  weather = input<CurrentWeather>();
}
