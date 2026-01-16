import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});
