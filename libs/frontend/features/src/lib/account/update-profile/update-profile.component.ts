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
      this.authService.getUserFromLocalStorage().subscribe((user: IUser | null) => {
        if (user !== null) {
          this.userId = user.id;

    
          // Fetch other user details based on userId
          this.userService.readOne(this.userId).subscribe((observable) => {
            this.user = observable;

           // Initialize selectedTags with the user's tags
          this.selectedTags = this.user?.tags || [];
          });
        } else {
          console.log('User is not logged in');
        }
      });
    
      this.fetchDistinctTags();
    }
    

    updateUser() {
      console.log('Updating user:', this.user);
    
      if (this.userId) {
        this.userService.update(this.user, this.userId).subscribe({
          next: (updatedUser) => {
            console.log('User updated successfully:', updatedUser);
            this.router.navigate(['/profile']); 
          },
          error: (error) => {
            console.error('Error updating user:', error);
          }
        });
      } else {
        console.error('User ID is null. Cannot update user.');
      }
    }

    onTagSelectionChanged(tags: any) {
      this.selectedTags = tags;
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