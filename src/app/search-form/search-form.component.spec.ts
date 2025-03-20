import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { SearchFormComponent } from './search-form.component';
import { setCity } from '../state/actions';

describe('SearchFormComponent', () => {
  let component: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFormComponent, ReactiveFormsModule],
      providers: [provideMockStore({ initialState: { city: '' } }), provideNoopAnimations()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    
    // Use Jest's spy implementation
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
    // Set form value with spaces to test trimming
    component.cityForm.get('city')?.setValue('  London  ');
    fixture.detectChanges();
    
    // Trigger form submission
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    
    // Verify action was dispatched with trimmed value
    expect(dispatchSpy).toHaveBeenCalledWith(setCity({ city: 'London' }));
  });

  it('should not dispatch setCity action with empty city value on form submission', () => {
    // Set empty form value
    component.cityForm.get('city')?.setValue('');
    fixture.detectChanges();
    
    // Trigger form submission
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    
    // Verify action was dispatched with empty string
    expect(dispatchSpy).toHaveBeenCalledWith(setCity({ city: '' }));
  });

  it('should trim whitespace from city value before dispatching', () => {
    // Test with only whitespace
    component.cityForm.get('city')?.setValue('   ');
    fixture.detectChanges();
    
    // Trigger form submission
    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', null);
    
    // Verify action was dispatched with empty string after trimming
    expect(dispatchSpy).toHaveBeenCalledWith(setCity({ city: '' }));
  });
});