import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { INotification, NotificationType } from '@ihomer/api';
import { FrontendFeaturesModule, NotificationService } from '@ihomer/frontend/features';
import { UiModule } from '@ihomer/frontend/ui';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, UiModule, FrontendFeaturesModule, CommonModule],
  selector: 'ihomer-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  protected activeNotification$?: INotification | undefined;

  constructor(readonly notificationService: NotificationService) {
    this.activeNotification$ = {
      details: 'Details van foutmelding hier.',
      duration: 5000,
      title: 'Titel van foutmelding',
      type: NotificationType.Success
    }
    // this.notificationService.notification$.subscribe((notification) => {
    //   this.activeNotification$ = notification;
    //   setTimeout(() => {
    //     this.activeNotification$ = undefined;
    //   }, notification?.duration);
    // });
  }

  getNotificationColor(notification?: INotification): string {
    if (!notification) return '';
    switch (notification.type) {
      case NotificationType.Warning:
        return 'bg-warning';
      case NotificationType.Error:
        return 'bg-danger';
      case NotificationType.Success:
        return 'bg-success';
      default:
        return '';
    }
  }
}
