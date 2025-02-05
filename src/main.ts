import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, withComponentInputBinding, PreloadAllModules, withRouterConfig } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/shared/interceptors/auth.interceptor';
import { baseUrlInterceptor } from './app/shared/interceptors/base-url.interceptor';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withRouterConfig({paramsInheritanceStrategy: 'always'}), withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideExperimentalZonelessChangeDetection(),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
  ],
});
