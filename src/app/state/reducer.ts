import { createReducer, on } from '@ngrx/store';
import { LocationState } from '../contracts';
import { setCity } from './actions';

const CITY_STORAGE_KEY = 'weather_last_city';

function loadCityFromStorage(): string {
  try {
    return localStorage.getItem(CITY_STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}

function saveCityToStorage(city: string): void {
  try {
    if (city) {
      localStorage.setItem(CITY_STORAGE_KEY, city);
    }
  } catch {
    // Ignore storage errors
  }
}

export const initialState: LocationState = { city: loadCityFromStorage() };

export const locationReducer = createReducer(
  initialState,
  on(setCity, (state, { city }) => {
    saveCityToStorage(city);
    return { ...state, city };
  })
);