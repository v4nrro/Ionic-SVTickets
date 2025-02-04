import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { IntlCurrencyPipe } from '../../shared/pipes/events-filter.pipe';
import { MyEvent } from '../interfaces/MyEvent';
import { EventsService } from '../services/events.service';
import { IonCard, IonItem, IonIcon, IonLabel, IonButton, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { NavController, ActionSheetController } from '@ionic/angular';
import { close, eye, menu, peopleOutline, personCircleOutline, trash } from 'ionicons/icons';

// import { AttendComponent } from "../../shared/attend/attend.component";

@Component({
    selector: 'event-card',
    imports: [IntlCurrencyPipe, DatePipe, RouterLink, IonCard, IonItem, IonIcon, IonLabel, IonButton, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent /* AttendComponent */],
    templateUrl: './event-card.component.html',
    styleUrl: './event-card.component.css'
})

export class EventCardComponent {
    event = input.required<MyEvent>();
    deleted = output<void>();
    attended = output<void>();

    #eventsService = inject(EventsService);
    #destroyRef = inject(DestroyRef);
    #changeDetector = inject(ChangeDetectorRef);
    #navController = inject(NavController);
    #actionSheetCtrl =inject(ActionSheetController);

    constructor(){
        addIcons({peopleOutline, menu,trash, eye, close, personCircleOutline})
    }

    deleteEvent() {
        this.#eventsService
        .deleteEvent(this.event().id!)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => this.deleted.emit());
    }

    async showOptions(event: MyEvent) {
        const buttons = [
            {
                text: 'See details',
                role: '',
                icon: 'eye',
                handler: () => {
                    this.#navController.navigateForward(['/events', event.id]);
                },
            },
            {
                text: 'Creator page',
                icon: 'person-circle-outline',
                handler: () => {
                    this.#navController.navigateForward(['/users', event.creator.id]);
                },
            },
            {
                text: 'Cancel',
                icon: 'close',
                role: 'cancel',
            },
        ];
    
        if (event.mine) {
            buttons.unshift({
                text: 'Delete',
                role: 'destructive',
                icon: 'trash',
                handler: () => {
                    this.deleteEvent();
                },
            });
        }

        const actSheet = await this.#actionSheetCtrl.create({
            header: event.description,
            buttons: buttons,
        });
    
        actSheet.present();
    }

    attendEvent(attend: boolean) {
        const oldAttend = this.event().attend;
        const oldNumAttend = this.event().numAttend;

        this.event().attend = attend;
        this.event().numAttend ++;

        this.#eventsService
        .attendEvent(this.event().id!)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
            next: () => {
                this.attended.emit();
            },
            error: () => {
                this.event().attend = oldAttend;
                this.event().numAttend = oldNumAttend;
                this.#changeDetector.markForCheck();
            }
        });
       
    }

    deleteAttend(attend: boolean) {
        const oldAttend = this.event().attend;
        const oldNumAttend = this.event().numAttend;

        this.event().attend = attend;
        this.event().numAttend --;

        this.#eventsService
        .deleteAttend(this.event().id!)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
            next: () => {
                this.attended.emit();
            },
            error: () => {
                this.event().attend = oldAttend;
                this.event().numAttend = oldNumAttend;
                this.#changeDetector.markForCheck();
            }
        });
    }
}
