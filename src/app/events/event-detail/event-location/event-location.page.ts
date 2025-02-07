import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar, IonFab, IonFabButton, IonIcon, IonText } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { OlMapDirective } from 'src/app/shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/shared/ol-maps/ol-marker.directive';
import { addIcons } from 'ionicons';
import { navigate } from 'ionicons/icons';
import { LaunchNavigator } from '@awesome-cordova-plugins/launch-navigator';

@Component({
  selector: 'app-event-location',
  templateUrl: './event-location.page.html',
  styleUrls: ['./event-location.page.scss'],
  standalone: true,
  imports: [IonText, IonIcon, IonFabButton, IonFab, 
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    OlMapDirective,
    OlMarkerDirective,
  ],
})
export class EventLocationPage implements OnInit {
  event = inject(EventDetailPage).event;

  coordinates = signal<[number, number]>([this.event()!.lng, this.event()!.lat]);
  
  
  constructor() {
    addIcons({navigate});
  }

  ngOnInit() {}

  openNavigation() {
    LaunchNavigator.navigate(this.event()!.address);
  }
  
}
