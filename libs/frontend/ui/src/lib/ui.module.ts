import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterLink } from '@angular/router';
import { BendeOverviewComponent } from './bendes/overview/overview.component';

@NgModule({
  imports: [CommonModule, RouterLink],
  declarations: [HeaderComponent, BendeOverviewComponent],
  exports: [HeaderComponent, BendeOverviewComponent],
})
export class UiModule {}
