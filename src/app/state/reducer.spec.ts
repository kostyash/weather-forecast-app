import { Action } from '@ngrx/store';
import { locationReducer, initialState } from './reducer';
import { setCity } from './actions';

describe('locationReducer', () => {
  it('should return the initial state', () => {
    const state = locationReducer(undefined, { type: '@@init' } as Action);
    expect(state).toEqual(initialState);
  });

  it('should set city on setCity action', () => {
    const state = locationReducer(initialState, setCity({ city: 'London' }));
    expect(state.city).toBe('London');
  });
});
