import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '@ihomer/api';

@Component({
  selector: 'ihomer-profile',
  templateUrl: './profile.component.html', 
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  user!: IUser;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    readonly authService: AuthService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.authService.getUserFromLocalStorage().subscribe((user: IUser | null) => {
        if (user !== null) {
          this.userId = user.id;
          if (this.userId) {
            this.userService.readOne(this.userId).subscribe((user) => {
              if (user) this.user = user;
            })
          } else {
            this.authService.currentUser$.subscribe((user) => {
              if (user) this.user = user;
            })
          }
        } else {
            console.log('User is not logged in')
        }
      });
    });
  }}
