import { Component, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EventsService } from '../services/events.service';
import { minDateValidator } from 'src/app/shared/validators/min-date.validator';
import { ValidationClassesDirective } from 'src/app/shared/directives/validation-classes.directive';
import { EncodeBase64Directive } from 'src/app/shared/directives/encode-base64.directive';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.page.html',
  styleUrls: ['./event-form.page.scss'],
  standalone: true,
  imports: [ValidationClassesDirective, ReactiveFormsModule, DatePipe, EncodeBase64Directive, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EventFormPage implements OnInit {

    #eventsService = inject(EventsService);
    #destroyRef = inject(DestroyRef);
    #router = inject(Router);
    #saved = false;
    #fb = inject(NonNullableFormBuilder);
  
    coordinates = signal<[number, number]>([-0.5, 38.5]);
    address = signal<string>('');
  
    // changePlace(result: SearchResult) {
    //   this.coordinates.set(result.coordinates);
    //   this.address.set(result.address);
    // }
  
    minDate = new Date().toISOString().substring(0, 10);
  
    eventForm = this.#fb.group({
      title: ['',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern('^[a-zA-Z][a-zA-Z ]*$'),
        ],
      ],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: [0, [Validators.required, Validators.min(0.1)]],
      image: ['', [Validators.required]],
      date: ['', [Validators.required, minDateValidator(this.minDate)]],
    });
    imageBase64 = '';
  
    constructor(){

    }

    ngOnInit() {

    }
  
    canDeactivate() {
      if (this.#saved || this.eventForm.pristine){
          return true
      }
      else{
        return false;
      }
    }
  
    addEvent() {
      this.#eventsService
        .addEvent({
          ...this.eventForm.getRawValue(),
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
}
