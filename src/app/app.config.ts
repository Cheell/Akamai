import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SessionService } from './services/session.service';
import { from, Observable, of } from 'rxjs';

function initializeAppFactory(preloadService: SessionService): () => Observable<any> {
  preloadService.load();
  return () => of(true);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [SessionService],
      multi: true,
    }
  ]
};
