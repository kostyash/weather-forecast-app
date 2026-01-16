import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { setCity } from '../state/actions';

@Component({
  selector: 'app-search-form',
  imports: [ReactiveFormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchFormComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  cityForm = this.fb.group({
    city: ['']
  });

  onSubmit(): void {
    const city = this.cityForm.value.city?.trim() ?? '';
    this.store.dispatch(setCity({ city }));
  }
}
