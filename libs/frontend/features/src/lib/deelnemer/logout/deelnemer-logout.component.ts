import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'ihomer-logout-deelnemer',
  templateUrl: './deelnemer-logout.component.html', 
  styleUrls: ['./deelnemer-logout.component.css'],
})
export class LogoutComponent implements OnInit{

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit(): void {
    this.authService.logout();
  }
}