import { Injectable } from '@angular/core';
import { NotificationType, INotification } from '@ihomer/shared/api';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    readonly notification$ = new BehaviorSubject<INotification | undefined>(undefined);
    
    constructor() {}

    success(title: string, details: string, duration = 3000) {
        this.notify(title, details, duration, NotificationType.Success);
    }
    info(title: string, details: string, duration = 3000) {
        this.notify(title, details, duration, NotificationType.Info);
    }
    warning(title: string, details: string, duration = 3000) {
        this.notify(title, details, duration, NotificationType.Warning);
    }
    error(title: string, details: string, duration = 3000) {
        this.notify(title, details, duration, NotificationType.Error);
    }
    
    private notify(title: string, details: string, duration = 3000, type: NotificationType) {
        const notification: INotification = {
            title, details, duration, type
        };
        this.notification$.next(notification);
    }
}