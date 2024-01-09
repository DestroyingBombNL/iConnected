import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '@ihomer/api';

@Component({
  selector: 'ihomer-update-profile',
  templateUrl: './update-profile.component.html', 
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit {
  user!: IUser;
  userId: string | null = null;
  distinctTags: string[] = [];
  selectedTags: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    readonly authService: AuthService,
    private router: Router 
    ) {}

    ngOnInit(): void {
      this.route.paramMap.subscribe((params) => {
        this.userId = params.get('id');
  
        // Bestaande user
        this.userService.readOne(this.userId).subscribe((observable) => {
          this.user = observable;
    
          // Initialize selectedTags with the user's tags
          this.selectedTags = this.user?.tags || [];
        });
      });
  
      // Retrieve user ID from AuthService
      this.authService.currentUser$.subscribe({
        next: (user: IUser | null) => {
          if (user) {
            this.userId = user.id;
          }
        },
        error: (error) => {
          console.error('Error getting user information:', error);
        },
      });
  
      this.fetchDistinctTags();
    }

    onTagSelectionChanged(tags: any) {
      this.selectedTags = tags;
    }
    
    updateUser() {
      if (this.userId !== this.user?.id) {
        console.error('Current user is not the creator of the user. Updating is not allowed.');
        return;
      }
    
      console.log('Updating user:', this.user);
      
      this.userService.update(this.user, this.userId).subscribe({
        next: (updatedUser) => {
          console.log('User updated successfully:', updatedUser);
          this.router.navigate(['/profile']); 
        },
        error: (error) => {
          console.error('Error updating user:', error);
        }
      });
    }

    private fetchDistinctTags(): void {
      this.userService.getDistinctTagsForAllUsers().subscribe(
        (response: any) => {
          this.distinctTags = response.results;
          console.log('Distinct Tags for All Users:', this.distinctTags);
        },
        (error: any) => {
          console.error('Error fetching distinct tags:', error);
        }
      );
    }

    
}