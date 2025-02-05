import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { EventDetailPage } from '../event-detail.page';

@Component({
  selector: 'app-event-comments',
  templateUrl: './event-comments.page.html',
  styleUrls: ['./event-comments.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class EventCommentsPage implements OnInit {
  event = inject(EventDetailPage).event

  constructor() { }

  ngOnInit() {
  }

}
