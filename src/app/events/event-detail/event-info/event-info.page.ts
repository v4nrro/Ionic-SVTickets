import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { EventCardComponent } from "../../event-card/event-card.component";
import { EventsService } from '../../services/events.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-event-info',
  templateUrl: './event-info.page.html',
  styleUrls: ['./event-info.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, EventCardComponent]
})
export class EventInfoPage implements OnInit {
  event = inject(EventDetailPage).event
  #eventsService = inject(EventsService)
  #nav = inject(NavController);


  constructor() { }

  ngOnInit() {
  }
}
