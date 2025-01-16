import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { setCity } from '../state/actions';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent {
  cityForm: FormGroup;

  store = inject(Store);

  constructor(private fb: FormBuilder) {
    this.cityForm = this.fb.group({
      city: ['']
    })
  }

  onSubmit(): void {
    this.store.dispatch(setCity({ city: this.cityForm.value.city.trim() }));
  }
}
