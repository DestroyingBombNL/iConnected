import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterLink],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class UiModule {}
