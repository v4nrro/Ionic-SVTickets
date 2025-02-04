import { Component, inject, signal } from '@angular/core';
import { IonSearchbar , InfiniteScrollCustomEvent, IonInfiniteScrollContent, IonInfiniteScroll, NavController, ActionSheetController, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonThumbnail,IonLabel, IonButton } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { EventsService } from '../services/events.service';
import { MyEvent } from '../interfaces/MyEvent';
import { EventCardComponent } from '../event-card/event-card.component';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonSearchbar ,IonInfiniteScrollContent, IonInfiniteScroll, EventCardComponent, CurrencyPipe, RouterLink, IonRouterLink, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonThumbnail,IonLabel, IonButton]
})
export class HomePage {
  events = signal<MyEvent[]>([]);
  page = signal<number>(1);
  searchQuery = signal<string>(''); // Stores search term

  #eventsService = inject(EventsService);

  constructor(){
    addIcons({add});
  }

  ionViewWillEnter() {
    this.reloadProducts();
  }

  reloadProducts(refresher?: IonRefresher) {
    this.page.set(1)
    this.#eventsService
    .getEvents("distance", this.page(), this.searchQuery())
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

  addProducts(){
    this.#eventsService
    .getEvents("distance", this.page(), "")
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
    this.addProducts();
    setTimeout(() => {
      event.target.complete();
    }, 600);
  }

  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.trim().toLowerCase() || '';

    this.searchQuery.set(query);
    this.page.set(1);
    this.reloadProducts();
  }
}
