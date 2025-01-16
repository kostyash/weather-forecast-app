import { createReducer, on } from '@ngrx/store';
import { LocationState } from '../contracts';
import { setCity } from './actions';

export const initialState: LocationState = {city : ''};

export const locationReducer = createReducer(
  initialState,
  on(setCity, (state, {city}) => ({...state , city }))  
);