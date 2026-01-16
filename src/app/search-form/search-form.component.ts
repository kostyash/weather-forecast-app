import { ChangeDetectionStrategy, Component, inject, signal, DestroyRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { setCity } from '../state';
import { MeteoService } from '../meteo.service';
import { LocationSuggestion } from '../contracts';

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
  private meteoService = inject(MeteoService);
  private destroyRef = inject(DestroyRef);

  cityForm = this.fb.group({
    city: ['']
  });

  suggestions = signal<LocationSuggestion[]>([]);
  showDropdown = signal(false);
  activeIndex = signal(-1);

  constructor() {
    this.cityForm.get('city')!.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => !!query && query.length >= 2),
      switchMap(query => this.meteoService.searchLocations(query!))
    ).subscribe(results => {
      this.suggestions.set(results);
      this.showDropdown.set(results.length > 0);
      this.activeIndex.set(-1);
    });
  }

  onSubmit(): void {
    const city = this.cityForm.value.city?.trim() ?? '';
    if (city) {
      this.store.dispatch(setCity({ city }));
      this.hideDropdown();
    }
  }

  selectSuggestion(suggestion: LocationSuggestion): void {
    this.cityForm.patchValue({ city: suggestion.name });
    this.store.dispatch(setCity({ city: suggestion.name }));
    this.hideDropdown();
  }

  onKeydown(event: KeyboardEvent): void {
    const suggestions = this.suggestions();
    if (!this.showDropdown() || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.activeIndex.set(Math.min(this.activeIndex() + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.activeIndex.set(Math.max(this.activeIndex() - 1, -1));
        break;
      case 'Enter':
        if (this.activeIndex() >= 0) {
          event.preventDefault();
          this.selectSuggestion(suggestions[this.activeIndex()]);
        }
        break;
      case 'Escape':
        this.hideDropdown();
        break;
    }
  }

  onBlur(): void {
    // Delay to allow click on suggestion
    setTimeout(() => this.hideDropdown(), 200);
  }

  onFocus(): void {
    if (this.suggestions().length > 0) {
      this.showDropdown.set(true);
    }
  }

  private hideDropdown(): void {
    this.showDropdown.set(false);
    this.activeIndex.set(-1);
  }

  formatSuggestion(s: LocationSuggestion): string {
    return s.region ? `${s.name}, ${s.region}, ${s.country}` : `${s.name}, ${s.country}`;
  }
}
