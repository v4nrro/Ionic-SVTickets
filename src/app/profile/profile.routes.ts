import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
    {
        path: 'me',
        loadComponent: () =>
          import('./profile/profile.page').then(
            (m) => m.ProfilePage
          ),
        title: 'My Profile Page',
    },
    {
        path: ':id',
        loadComponent: () =>
        import('./profile/profile.page').then(
            (m) => m.ProfilePage
        ),
        title: 'Profile Page',
    },
];