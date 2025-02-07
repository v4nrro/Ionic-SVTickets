import { Component, computed, effect, inject, input, numberAttribute, viewChild } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertController, IonAvatar, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonToolbar, Platform } from '@ionic/angular/standalone';
import { EventsService } from '../../services/events.service';
import { EventDetailPage } from '../event-detail.page';

@Component({
  selector: 'event-comments',
  templateUrl: './event-comments.page.html',
  styleUrls: ['./event-comments.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, IonRefresher, IonRefresherContent, IonFab, IonFabButton, IonIcon, IonList, IonItem, IonAvatar, IonImg, IonLabel]
})
export class EventCommentsPage {
  #alertCtrl = inject(AlertController);
  #eventsService = inject(EventsService);
  #platform = inject(Platform);
  event = inject(EventDetailPage).event

  ionRefresher = viewChild.required(IonRefresher);

  id = input.required({ transform: numberAttribute });
  commentsResource = rxResource({
    request: () => this.id(),
    loader: ({request: id}) => this.#eventsService.getComments(id)
  });

  comments = computed(() => this.commentsResource.value()?.comments ?? []);

  constructor() {
    this.#platform.resume.pipe(takeUntilDestroyed()).subscribe(
      () => this.commentsResource.reload() // Recargamos comentarios cuando la aplicación se reactiva (resume)
    );

    effect(() => {
      if(!this.commentsResource.isLoading()) {
        this.ionRefresher().complete(); // Si estaba la animación de carga, una vez tenemos comentarios cargados, se cancela
      }
    });
  }

  loadComments(refresher?: IonRefresher) {
    this.commentsResource.reload();
  }

  async addComment() {
    const alert = await this.#alertCtrl.create({
      header: 'New commment',
      inputs: [
        {
          name: 'comment',
          type: 'text',
          placeholder: 'Enter your comment',
        },
      ],
      buttons: [
        {
          text: 'Add',
          role: 'ok',
        },
        {
          role: 'cancel',
          text: 'Cancel',
        },
      ],
    });

    await alert.present();
    const result = await alert.onDidDismiss();

    if (result.role === 'ok') {
      this.#eventsService
        .postComment(this.id(), result.data.values.comment)
        .subscribe((newComment) => {
            this.commentsResource.update((currentResponse) => ({
              ...currentResponse,
              comments: [...currentResponse!.comments, newComment]
            }));
        });
    }
  }
}
