import { createAction, props } from '@ngrx/store';

export const setCity = createAction('[Location] Set City', props<{ city: string }>());