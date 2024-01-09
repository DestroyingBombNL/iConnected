import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IUser, IBlob, IBende, IProject } from '@ihomer/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ihomer-profile',
  templateUrl: './profile.component.html', 
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  userId: string | null = null;
  user!: IUser;
  blobs: IBlob[] = [];
  bendes: IBende[] = [];
  projects: IProject[] = [];
  private userSub: Subscription | undefined;
  private profileSub: Subscription | undefined;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.userSub = this.authService.getUserFromLocalStorage().subscribe((user: IUser | null) => {
        if (user !== null) {
          this.userId = user.id;
          if (this.userId) {
            this.profileSub = this.userService.getProfile(this.userId).subscribe((profile) => {
              if (profile.user) this.user = profile.user;
              if (profile.blobs) this.blobs = profile.blobs;
              if (profile.bendes) this.bendes = profile.bendes;
              if (profile.projects) this.projects = profile.projects;
            });
          } else {
            this.authService.currentUser$.subscribe((user) => {
              if (user) this.user = user;
            });
          }
        } else {
          console.log('User is not logged in');
        }
      });
    });
  }
}
