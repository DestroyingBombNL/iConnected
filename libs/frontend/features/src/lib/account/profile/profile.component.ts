import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IBende, IBlob, IProject, IUser } from '@ihomer/api';

@Component({
  selector: 'ihomer-profile',
  templateUrl: './profile.component.html', 
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  user!: IUser;
  blobs: Array<IBlob> = []
  bendes: Array<IBende> = []
  projects: Array<IProject> = []

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
            this.userService.getProfile(this.userId).subscribe((profile) => {
              if (profile.user) this.user = user;
              if (profile.blobs) this.blobs = profile.blobs;
              if (profile.bendes) this.bendes = profile.bendes;
              if (profile.projects) this.projects = profile.projects;
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
