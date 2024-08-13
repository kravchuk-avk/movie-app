import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { MoviesEffects } from './store/effects';
import { moviesReducer } from './store/reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ movies: moviesReducer }),
    provideEffects([MoviesEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: environment.production }),
  ],
};
