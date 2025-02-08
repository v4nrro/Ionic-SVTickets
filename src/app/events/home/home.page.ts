import { Component, inject, signal } from '@angular/core';
import {
  IonSearchbar,
  InfiniteScrollCustomEvent,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  IonRouterLink,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
} from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../interfaces/MyEvent';
import { EventCardComponent } from '../event-card/event-card.component';
import { addIcons } from 'ionicons';
import { add, menu } from 'ionicons/icons';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonSearchbar,
    IonInfiniteScrollContent,
    IonInfiniteScroll,
    EventCardComponent,
    RouterLink,
    IonRouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonList,
  ],
})
export class HomePage {
  events = signal<MyEvent[]>([]);
  page = signal<number>(1);
  searchQuery = signal<string>(''); // Stores search term

  #eventsService = inject(EventsService);

  constructor() {
    addIcons({ add, menu });
  }

  ionViewWillEnter() {
    this.reloadEvents();
  }

  reloadEvents(refresher?: IonRefresher) {
    this.page.set(1);
    this.#eventsService
      .getEvents('distance', this.page(), this.searchQuery())
      .subscribe((myEvents) => {
        if (this.page() === 1) {
          this.events.set(myEvents);
        } else {
          this.events.update((events) => [...events, ...myEvents]);
        }
        refresher?.complete();
      });
  }

  deleteEvent(event: MyEvent) {
    this.events.update((events) => events.filter((e) => e !== event));
  }

  addEvents() {
    this.#eventsService
      .getEvents('distance', this.page(), '')
      .subscribe((myEvents) => {
        if (this.page() === 1) {
          this.events.set(myEvents);
        } else {
          this.events.update((events) => [...events, ...myEvents]);
        }
      });
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    this.page.update((page) => page + 1);
    this.addEvents();
    setTimeout(() => {
      event.target.complete();
    }, 600);
  }

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.trim().toLowerCase() || '';

    this.searchQuery.set(query);
    this.page.set(1);
    this.reloadEvents();
  }
}
