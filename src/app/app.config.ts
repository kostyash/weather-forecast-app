import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { cachingInterceptor } from './caching.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { FeatureKey } from './state/selectors';
import { locationReducer } from './state/reducer';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)
    , provideHttpClient(withInterceptors([cachingInterceptor])),
     provideStore(),
      provideState({ name: FeatureKey, reducer: locationReducer }),
      provideStoreDevtools({ maxAge: 25, logOnly: false })]
};
