import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonLabel,
  IonItem,
  IonText,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSearchbar,
  IonIcon,
  IonImg,
  IonInput,
  IonTextarea,
} from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { EventsService } from '../services/events.service';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator';
import { Camera, CameraSource, CameraResultType } from '@capacitor/camera';
import { SearchResult } from '../../shared/ol-maps/interfaces/search-result';
import { Geolocation } from '@capacitor/geolocation';
import { GaAutocompleteDirective } from 'src/app/shared/ol-maps/ga-autocomplete.directive';
import { OlMapDirective } from 'src/app/shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/ol-maps/ol-marker.directive';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.page.html',
  styleUrls: ['./event-form.page.scss'],
  standalone: true,
  imports: [
    IonTextarea,
    IonGrid,
    IonRow,
    IonCol,
    IonInput,
    IonImg,
    IonIcon,
    IonLabel,
    IonButton,
    RouterLink,
    IonItem,
    IonList,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    OlMapDirective,
    OlMarkerDirective,
    GaAutocompleteDirective
],
})
export class EventFormPage implements OnInit {
  #eventsService = inject(EventsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #saved = false;
  #changeDetector = inject(ChangeDetectorRef);

  coordinates = signal<[number, number]>([-0.5, 38.5]);
  address = signal<string>('Prueba');
  validInputId = false;

  @ViewChild(IonSearchbar) searchBar!: IonSearchbar;

  constructor() {
    this.getPosition();
  }

  async getPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.coordinates.set([
      coordinates.coords.longitude,
      coordinates.coords.latitude,
    ]);
  }

  startNavigation() {
    LaunchNavigator.navigate(this.coordinates().reverse());
  }

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address.set(result.address);
  }


  myEvent = {
    title: '',
    description: '',
    price: 1,
    date: '',
  };

  minDate = new Date().toISOString().substring(0, 10);
  imageBase64 = '';

  ngOnInit() {}

  //   canDeactivate() {
  //     if (this.#saved || this.eventForm.pristine) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }

  addEvent() {
    console.log(
      this.myEvent.title,
      this.myEvent.date,
      this.myEvent.description,
      this.myEvent.price,
      this.imageBase64,
      this.coordinates()[1],
      this.coordinates()[0],
      this.address()
    );
    this.#eventsService
      .addEvent({
        title: this.myEvent.title,
        date: this.myEvent.date,
        description: this.myEvent.description,
        price: this.myEvent.price,
        image: this.imageBase64,
        lat: this.coordinates()[1],
        lng: this.coordinates()[0],
        address: this.address(),
      })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.#saved = true;
        this.#router.navigate(['/events']);
      });
  }

  async takePhoto() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 768,
      width: 1024,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.imageBase64 = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 768,
      width: 1024,
      allowEditing: true,
      resultType: CameraResultType.DataUrl, // Base64 (url encoded)
    });

    this.imageBase64 = photo.dataUrl as string;
    this.#changeDetector.markForCheck();
  }
}
