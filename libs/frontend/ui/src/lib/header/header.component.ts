import { Component } from '@angular/core';
import { AuthService } from '@ihomer/frontend/features';

@Component({
  selector: 'ihomer-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isMenuCollapsed = true;
  constructor(private readonly authService: AuthService) {}
}