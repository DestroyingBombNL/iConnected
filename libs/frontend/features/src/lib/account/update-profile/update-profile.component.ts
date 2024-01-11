import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IBende, IBlob, IProject, IUser } from '@ihomer/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

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
  updateProfile: FormGroup;
  private profileSub: Subscription | undefined;
  blobs: IBlob[] = [];
  bendes: IBende[] = [];
  projects: IProject[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    readonly authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder, 
    ) {
      this.updateProfile = this.formBuilder.group({
        firstName: ['', [Validators.required]],
        infix: [''],
        lastName: ['', [Validators.required]],
        birthday: ['', [Validators.required, this.dateValidator]],
        email: ['', [Validators.required, this.validEmail]],
        street: ['', [Validators.required]],
        houseNumber: ['', [Validators.required, this.houseNumberValidator]],
        postalCode: ['', [Validators.required, this.postalCodeValidator]],
        city: ['', [Validators.required]],
        password: ['', [Validators.required, this.validPassword]]
      });
    }

    ngOnInit(): void {
      this.authService.getUserFromLocalStorage().subscribe((user: IUser | null) => {
        if (user !== null) {
          this.userId = user.id;
    
          this.userService.readOne(this.userId).subscribe((observable) => {
            this.user = observable;
    
            this.selectedTags = this.user?.tags || [];
    
            this.profileSub = this.userService.getProfile(this.userId).subscribe((profile) => {
              if (profile.user) this.user = profile.user;
              if (profile.blobs) this.blobs = profile.blobs;
              if (profile.bendes) this.bendes = profile.bendes;
              if (profile.projects) this.projects = profile.projects;
            });
          });
        } else {
          console.log('User is not logged in');
        }
        this.fetchDistinctTags();
      });
    }
    
    updateUser() {
      console.log('Updating user:', this.user);
    
      if (this.userId) {
        this.user.tags = this.selectedTags;
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
      console.log(this.selectedTags)

      this.selectedTags = tags;
    }
    
    private fetchDistinctTags(): void {
      this.userService.getDistinctTagsForAllUsers().subscribe(
        (response: any) => {
          console.log(response);
          this.distinctTags = response.results;
          console.log('Distinct Tags for All Users:', this.distinctTags);
        },
        (error: any) => {
          console.error('Error fetching distinct tags:', error);
        }
      );
    }

    validEmail(control: FormControl): { [s: string]: boolean } | null {
      const email = control.value;
      const regexp = /^[a-zA-Z\d]+@[a-zA-Z]+\.[a-zA-Z]+$/;
      return regexp.test(email) ? null : { invalidEmail: true };
    }
    
    validPassword(control: FormControl): { [s: string]: boolean } | null {
      const password = control.value;
      const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:'",.<>?/|\\[\]`~])(?!.*\s).{8,}$/;
      return regexp.test(password) ? null : { invalidPassword: true };
    }

    houseNumberValidator(control: FormControl): { [s: string]: boolean } | null {
      const houseNumber = control.value;
      const regexp = /^[1-9]\d{0,4}([a-zA-Z]{1,2})?$/;

      return regexp.test(houseNumber) ? null : { invalidhouseNumber: true };
    }

    dateValidator(control: FormControl): { [s: string]: boolean } | null {
      const selectedDate = new Date(control.value);
      const currentDate = new Date();
      const minDate = new Date('1900-01-01');
  
      if (selectedDate > currentDate) {
        return { dateInFuture: true };
      }
  
      if (selectedDate < minDate) {
        return { dateBefore1900: true };
      }
  
      return null;
    }

    postalCodeValidator(control: FormControl): { [s: string]: boolean } | null {
      const postalCode = control.value;
  
      const regex = /^(?:(?:[1-9]\d{3})\s?[a-zA-Z]{2}|(\d{4}\s?.+))$/;
  
      return regex.test(postalCode) ? null : { invalidPostalCode: true };
    }    
}