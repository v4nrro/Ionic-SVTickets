import { Routes } from '@angular/router';

export const eventsRoutes: Routes = [
    {
        path: '',
        loadComponent: () =>
          import('./home/home.page').then((m) => m.HomePage),
    },
    {
        path: 'add',
        loadComponent: () =>
          import('./event-form/event-form.page').then(
            (m) => m.EventFormPage
          ),
    },
    {
        path: ':id',
        loadComponent: () =>
          import('./event-detail/event-detail.page').then(
            (m) => m.EventDetailPage
          ),
        loadChildren: () => // Rutas internas (dentro de product-detail)
          import('./event-detail/event-detail.routes').then((m) => m.eventDetailRoutes),
    }
];