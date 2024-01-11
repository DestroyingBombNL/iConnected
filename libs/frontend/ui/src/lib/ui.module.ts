import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [CommonModule, RouterLink, RouterLinkActive, NgbModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class UiModule {}
