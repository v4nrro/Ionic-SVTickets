import { ChangeDetectorRef, Component, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonIcon, IonButton, IonCol, IonRow, IonText, IonGrid } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';
import { addIcons } from 'ionicons';
import { peopleOutline, thumbsUpOutline, thumbsDownOutline } from 'ionicons/icons';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-event-attend',
  templateUrl: './event-attend.page.html',
  styleUrls: ['./event-attend.page.scss'],
  standalone: true,
  imports: [IonGrid, IonText, IonRow, IonCol, IonButton, IonIcon, IonContent, IonHeader, IonToolbar, CommonModule, FormsModule]
})
export class EventAttendPage implements OnInit {
  event = inject(EventDetailPage).event
  #eventsService = inject(EventsService)
  #changeDetectorRef = inject(ChangeDetectorRef)

  constructor() { 
    addIcons({peopleOutline,thumbsUpOutline,thumbsDownOutline});

    effect(() => {
    })
  }

  ngOnInit() {
  }

  attend(){
    this.#eventsService.attendEvent(this.event()!.id)
    .subscribe(() => {
        this.event()!.attend = true;
        this.event()!.numAttend += 1;

        this.#changeDetectorRef.markForCheck()
    })
  } 

  removeAttend(){
    this.#eventsService.deleteAttend(this.event()!.id)
    .subscribe(() => {
        this.event()!.attend = false;
        this.event()!.numAttend -= 1;

        this.#changeDetectorRef.markForCheck()
    })
  }
}
