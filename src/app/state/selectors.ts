import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LocationState } from "../contracts";

export const FeatureKey = 'LOCATION_STATE'
export const selectLocationState = createFeatureSelector<LocationState>(FeatureKey);
export const selectCity = createSelector(selectLocationState, (state) => state.city);