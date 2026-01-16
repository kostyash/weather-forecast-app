import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SearchFormComponent } from './search-form.component';
import { setCity } from '../state/actions';
import { MeteoService } from '../meteo.service';
import { of } from 'rxjs';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;
  let meteoServiceMock: Partial<MeteoService>;

  beforeEach(async () => {
    meteoServiceMock = {
      searchLocations: jest.fn().mockReturnValue(of([]))
    };

    await TestBed.configureTestingModule({
      imports: [SearchFormComponent, ReactiveFormsModule],
      providers: [
        provideMockStore({ initialState: { city: '' } }),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MeteoService, useValue: meteoServiceMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    dispatchSpy = jest.spyOn(store, 'dispatch');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty city form control', () => {
    expect(component.cityForm.get('city')?.value).toBe('');
  });

  it('should have a form with city input field', () => {
    const cityInput = fixture.debugElement.query(By.css('input#city'));
    expect(cityInput).toBeTruthy();
  });

  it('should have a submit button', () => {
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(submitButton).toBeTruthy();
    expect(submitButton.nativeElement.textContent).toContain('Search');
  });

  it('should update form value when input changes', () => {
    const cityInput = fixture.debugElement.query(By.css('input#city')).nativeElement;
    cityInput.value = 'New York';
    cityInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.cityForm.get('city')?.value).toBe('New York');
  });

  it('should dispatch setCity action with trimmed city value on form submission', () => {
    component.cityForm.get('city')?.setValue('  London  ');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(dispatchSpy).toHaveBeenCalledWith(setCity({ city: 'London' }));
  });

  it('should not dispatch setCity action with empty city value on form submission', () => {
    component.cityForm.get('city')?.setValue('');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should not dispatch setCity action when only whitespace on form submission', () => {
    component.cityForm.get('city')?.setValue('   ');
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should initialize with dropdown hidden', () => {
    expect(component.showDropdown()).toBe(false);
    expect(component.suggestions().length).toBe(0);
  });

  it('should select suggestion and dispatch action', () => {
    const suggestion = { name: 'Tel Aviv', region: 'Tel Aviv', country: 'Israel' };
    component.selectSuggestion(suggestion);

    expect(component.cityForm.get('city')?.value).toBe('Tel Aviv');
    expect(dispatchSpy).toHaveBeenCalledWith(setCity({ city: 'Tel Aviv' }));
    expect(component.showDropdown()).toBe(false);
  });

  describe('keyboard navigation', () => {
    const suggestions = [
      { name: 'London', region: 'England', country: 'UK' },
      { name: 'Los Angeles', region: 'California', country: 'USA' },
      { name: 'Lyon', region: 'Auvergne-Rhône-Alpes', country: 'France' }
    ];

    beforeEach(() => {
      component.suggestions.set(suggestions);
      component.showDropdown.set(true);
      component.activeIndex.set(-1);
    });

    it('should do nothing on keydown when dropdown is hidden', () => {
      component.showDropdown.set(false);
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      jest.spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(component.activeIndex()).toBe(-1);
    });

    it('should do nothing on keydown when suggestions are empty', () => {
      component.suggestions.set([]);
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      jest.spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('should navigate down with ArrowDown key', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      jest.spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.activeIndex()).toBe(0);

      component.onKeydown(event);
      expect(component.activeIndex()).toBe(1);

      component.onKeydown(event);
      expect(component.activeIndex()).toBe(2);

      // Should not go beyond last item
      component.onKeydown(event);
      expect(component.activeIndex()).toBe(2);
    });

    it('should navigate up with ArrowUp key', () => {
      component.activeIndex.set(2);
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      jest.spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(component.activeIndex()).toBe(1);

      component.onKeydown(event);
      expect(component.activeIndex()).toBe(0);

      component.onKeydown(event);
      expect(component.activeIndex()).toBe(-1);

      // Should not go below -1
      component.onKeydown(event);
      expect(component.activeIndex()).toBe(-1);
    });

    it('should select suggestion with Enter key when item is active', () => {
      component.activeIndex.set(1);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      jest.spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(dispatchSpy).toHaveBeenCalledWith(setCity({ city: 'Los Angeles' }));
      expect(component.showDropdown()).toBe(false);
    });

    it('should not select with Enter key when no item is active', () => {
      component.activeIndex.set(-1);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      jest.spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it('should hide dropdown with Escape key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });

      component.onKeydown(event);

      expect(component.showDropdown()).toBe(false);
      expect(component.activeIndex()).toBe(-1);
    });

    it('should ignore other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      jest.spyOn(event, 'preventDefault');

      component.onKeydown(event);

      expect(event.preventDefault).not.toHaveBeenCalled();
      expect(component.activeIndex()).toBe(-1);
    });
  });

  describe('blur and focus', () => {
    it('should hide dropdown on blur after delay', fakeAsync(() => {
      component.showDropdown.set(true);
      component.activeIndex.set(1);

      component.onBlur();

      expect(component.showDropdown()).toBe(true); // Still visible immediately

      tick(200);

      expect(component.showDropdown()).toBe(false);
      expect(component.activeIndex()).toBe(-1);
    }));

    it('should show dropdown on focus when suggestions exist', () => {
      const suggestions = [{ name: 'London', region: 'England', country: 'UK' }];
      component.suggestions.set(suggestions);
      component.showDropdown.set(false);

      component.onFocus();

      expect(component.showDropdown()).toBe(true);
    });

    it('should not show dropdown on focus when no suggestions', () => {
      component.suggestions.set([]);
      component.showDropdown.set(false);

      component.onFocus();

      expect(component.showDropdown()).toBe(false);
    });
  });

  describe('formatSuggestion', () => {
    it('should format suggestion with region', () => {
      const suggestion = { name: 'London', region: 'England', country: 'UK' };
      const result = component.formatSuggestion(suggestion);
      expect(result).toBe('London, England, UK');
    });

    it('should format suggestion without region', () => {
      const suggestion = { name: 'Singapore', region: '', country: 'Singapore' };
      const result = component.formatSuggestion(suggestion);
      expect(result).toBe('Singapore, Singapore');
    });
  });
});
