import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { IonBackButton, IonButtons, IonHeader, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { EventsService } from '../services/events.service';
import { addIcons } from 'ionicons';
import { accessibilityOutline, chatboxEllipses, informationCircle, locationOutline } from 'ionicons/icons';

@Component({
  selector: 'event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class EventDetailPage  {
  #eventsService = inject(EventsService);

  constructor(){
    addIcons({informationCircle,chatboxEllipses,accessibilityOutline,locationOutline});
  }

  id = input.required({ transform: numberAttribute });
  productResource = rxResource({
    request: () => this.id(),
    loader: ({request: id}) => this.#eventsService.getEvent(id)
  });
  event = computed(() => this.productResource.value());
}