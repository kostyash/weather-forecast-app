import { createReducer, on } from '@ngrx/store';
import { setCity } from './actions';
import { LocationState } from '../contracts';

export const initialState: LocationState = {city : ''};

export const locationReducer = createReducer(
  initialState,
  on(setCity, (state, {city}) => ({...state , city }))  
);