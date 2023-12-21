import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notifications/notification.service';

@NgModule({
  imports: [CommonModule],
  providers: [NotificationService]
})
export class MyCommonModule {}
