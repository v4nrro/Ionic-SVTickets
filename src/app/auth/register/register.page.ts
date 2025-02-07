import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonRouterLink,
  ToastController,
  NavController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonIcon,
  IonImg,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonLabel,
} from '@ionic/angular/standalone';
import { User } from '../interfaces/user';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth.service';
import { ValueEqualsDirective } from 'src/app/shared/validators/value-equals.directive';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonRouterLink,
    ValueEqualsDirective,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonIcon,
    IonImg,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonLabel,
  ],
})
export class RegisterPage {
  coords = signal<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  user: User = {
    name: '',
    password: '',
    email: '',
    avatar: '',
    lat: 0,
    lng: 0,
  };
  password2 = '';

  constructor() {
    this.getLocation();
  }

  #authService = inject(AuthService);
  #toastCtrl = inject(ToastController);
  #nav = inject(NavController);
  #changeDetector = inject(ChangeDetectorRef);

  register() {
    this.#authService
      .register({
        name: this.user.name,
        password: this.user.password,
        email: this.user.email,
        avatar: this.user.avatar,
        lat: this.coords().lat,
        lng: this.coords().lng,
      })
      .subscribe(async () => {
        (
          await this.#toastCtrl.create({
            duration: 3000,
            position: 'bottom',
            message: 'User registered!',
          })
        ).present();
        this.#nav.navigateRoot(['/auth/login']);
      });
  }

  async getLocation() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    this.coords.set({
      lng: coordinates.coords.longitude,
      lat: coordinates.coords.latitude,
    });
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 200,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.user.avatar = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 200,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.user.avatar = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }
}
