import { Component } from '@angular/core';

@Component({
  selector: 'ihomer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuCollapsed = true;
  constructor() {}
}