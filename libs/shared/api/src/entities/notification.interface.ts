export interface INotification {
    title: string,
    details: string,
    type: NotificationType,
    duration: number
}

export enum NotificationType {
    Success,
    Warning,
    Error,
    Info
}