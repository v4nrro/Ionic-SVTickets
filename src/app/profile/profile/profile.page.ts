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
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonInput,
} from '@ionic/angular/standalone';
import { ProfileService } from '../services/profile.service';
import { User } from 'src/app/auth/interfaces/user';
import { OlMapDirective } from 'src/app/shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/ol-maps/ol-marker.directive';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { ValueEqualsDirective } from 'src/app/shared/validators/value-equals.directive';
import { ValidationClassesDirective } from 'src/app/shared/directives/validation-classes.directive';
import { OverlayEventDetail } from '@ionic/core/components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [
    IonInput,
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
    FormsModule,
    ReactiveFormsModule,
    OlMapDirective,
    OlMarkerDirective,
    ValueEqualsDirective,
  ],
})
export class ProfilePage implements OnInit {
  #profileService = inject(ProfileService);
  #changeDetectorRef = inject(ChangeDetectorRef);
  #fb = inject(NonNullableFormBuilder);

  profile = signal<User | null>(null);

  id = input.required({ transform: numberAttribute });

  coordinates = signal<[number, number]>([0, 0]);

  profileForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required]],
  });

  newAvatar = '';
  name = '';
  email = '';
  password = '';
  password2 = '';

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
      this.name = this.profile()!.name;
      this.email = this.profile()!.email;
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

  changeProfile() {
    console.log(this.email, this.name);
    this.#profileService
      .saveProfile({ email: this.email, name: this.name })
      .subscribe(() => {
        this.profile()!.email = this.email;
        this.profile()!.name = this.name;

        this.#changeDetectorRef.markForCheck();
      });
  }

  changePassword() {
    this.#profileService
      .savePassword({ password: this.password })
      .subscribe(() => {});
  }
}
