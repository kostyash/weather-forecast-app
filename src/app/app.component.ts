import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SearchFormComponent } from './search-form/search-form.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SearchFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'weather-forecast-app';
}
