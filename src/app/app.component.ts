import { Component, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { Platform, IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonRouterLink, IonRouterOutlet, IonSplitPane, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { User } from './auth/interfaces/user';
import { AuthService } from './auth/services/auth.service';
import { home, logIn, documentText, checkmarkCircle, images, camera, arrowUndoCircle, exit, add, personCircleOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonRouterLink, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonAvatar, IonImg],
})
export class AppComponent {
 user = signal<User | null>(null);

  #authService = inject(AuthService);
  #nav = inject(NavController);
  #platform = inject(Platform);

  public appPages = [
        { title: 'Home', url: '/events', icon: 'home' },
        { title: 'Add event', url: '/events/add', icon: 'add' },
        { title: 'My Profile', url: '/profile/me', icon: 'person-circle-outline'}
    ];
  
  constructor() {
    addIcons({ personCircleOutline, home, add, logIn, documentText, checkmarkCircle, images, camera, arrowUndoCircle, exit, });

    effect(() => {
      if (this.#authService.logged()) {
        this.#authService.getProfile().subscribe((user) => (this.user.set(user)));
      } else {
        this.user.set(null);
      }
    });

    this.initializeApp();
  }

  async logout() {
    await this.#authService.logout();
    this.#nav.navigateRoot(['/auth/login']);
  }

  async initializeApp() {
    if (this.#platform.is('capacitor')) {
      await this.#platform.ready();
      SplashScreen.hide();
    }
  }
}
