import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonAvatar,
  IonBackButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonImg,
  IonModal,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/angular/standalone';
import { ProfileService } from '../services/profile.service';
import { User } from 'src/app/auth/interfaces/user';
import { OlMapDirective } from 'src/app/shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/ol-maps/ol-marker.directive';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { ValueEqualsDirective } from 'src/app/shared/validators/value-equals.directive';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonRow,
    IonGrid,
    IonCol,
    IonModal,
    IonImg,
    IonIcon,
    IonButton,
    IonLabel,
    IonItem,
    IonButtons,
    IonBackButton,
    IonAvatar,
    IonSpinner,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    CommonModule,
    FormsModule,
    OlMapDirective,
    OlMarkerDirective,
    ValueEqualsDirective,
  ],
})
export class ProfilePage implements OnInit {
  #profileService = inject(ProfileService);
  #changeDetectorRef = inject(ChangeDetectorRef);

  profile = signal<User | null>(null);

  id = input.required({ transform: numberAttribute });

  coordinates = signal<[number, number]>([0, 0]);

  newAvatar = '';
  email2='';
  password2='';

  constructor() {}

  ngOnInit() {
    if (this.id()) {
      this.getProfile(this.id());
    } else {
      this.getMyProfile();
    }
  }

  getProfile(id: number) {
    this.#profileService.getProfile(id).subscribe((profile) => {
      this.profile.set(profile);
      this.coordinates.set([profile.lng, profile.lat]);
    });
  }
  getMyProfile() {
    this.#profileService.getMyProfile().subscribe((profile) => {
      this.profile.set(profile);
      this.coordinates.set([profile.lng, profile.lat]);
    });
  }

  changeImage() {
    this.#profileService
      .saveAvatar({ avatar: this.newAvatar })
      .subscribe(() => {
        this.profile()!.avatar = this.newAvatar;
        this.#changeDetectorRef.markForCheck();
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

    this.newAvatar = photo.dataUrl as string;
    this.#changeDetectorRef.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 200,
      width: 200,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.newAvatar = photo.dataUrl as string;
    this.#changeDetectorRef.markForCheck();
  }
}
