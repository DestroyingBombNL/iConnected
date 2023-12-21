import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { NotificationType, INotification } from '@ihomer/shared/api';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notification$: Subject<INotification | null> = new BehaviorSubject<INotification | null>(null);
    
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
        this.notification$.next({
            title: title,
            details: details,
            duration: duration,
            type: type
        } as INotification);
    }

    get notification() {
        return this.notification$.asObservable();
    }
}