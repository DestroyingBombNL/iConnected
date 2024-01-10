import { Injectable } from '@angular/core';
import { NotificationType, INotification } from '@ihomer/shared/api';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
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
        
    }
}