import { Action } from '@ngrx/store';
import { locationReducer, initialState } from './reducer';
import { setCity } from './actions';

describe('locationReducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return the initial state', () => {
    const state = locationReducer(undefined, { type: '@@init' } as Action);
    expect(state).toEqual(initialState);
  });

  it('should set city on setCity action', () => {
    const state = locationReducer(initialState, setCity({ city: 'London' }));
    expect(state.city).toBe('London');
  });

  it('should save city to localStorage when setCity is called', () => {
    locationReducer(initialState, setCity({ city: 'Paris' }));
    expect(localStorage.getItem('weather_last_city')).toBe('Paris');
  });

  it('should not save empty city to localStorage', () => {
    localStorage.setItem('weather_last_city', 'Berlin');
    locationReducer(initialState, setCity({ city: '' }));
    expect(localStorage.getItem('weather_last_city')).toBe('Berlin');
  });

  it('should handle localStorage.setItem errors gracefully', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });

    // Should not throw
    expect(() => {
      locationReducer(initialState, setCity({ city: 'Tokyo' }));
    }).not.toThrow();

    setItemSpy.mockRestore();
  });
});

describe('locationReducer localStorage loading', () => {
  it('should load city from localStorage on initialization', () => {
    localStorage.setItem('weather_last_city', 'Madrid');

    // Re-import the module to test initialization
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initialState: freshInitialState } = require('./reducer');

    expect(freshInitialState.city).toBe('Madrid');
  });

  it('should handle localStorage.getItem errors gracefully', () => {
    const getItemSpy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initialState: freshInitialState } = require('./reducer');

    expect(freshInitialState.city).toBe('');

    getItemSpy.mockRestore();
  });

  it('should return empty string when localStorage has no saved city', () => {
    localStorage.clear();

    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initialState: freshInitialState } = require('./reducer');

    expect(freshInitialState.city).toBe('');
  });
});
