import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IBende, IBlob, IProject, IUser } from '@ihomer/api';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ihomer-update-profile',
  templateUrl: './update-profile.component.html', 
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit {
  user!: IUser;
  userForm!: FormGroup; 
  allTags: string[] = [];

  constructor(readonly authService: AuthService, readonly userService: UserService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const localUser = this.authService.getUserFromLocalStorage();
    if (!localUser) return;
    this.getAllTags();
    this.route.paramMap.subscribe((params) => {
      this.userService.getProfile(params.get("id")).subscribe((profile) => {
        if (!profile.user) return;
        this.getAllTags();
        this.user = profile.user!;
        this.userForm = new FormGroup({
          firstName: new FormControl(this.user.firstName, [Validators.required]),
          infix: new FormControl(this.user.infix),
          lastName: new FormControl(this.user.lastName, [Validators.required]),
          bio: new FormControl(this.user.bio, [Validators.required]),
          birthday: new FormControl(this.user.birthday, [Validators.required, this.dateValidator]),
          email: new FormControl(this.user.email, [Validators.required, Validators.email]),
          street: new FormControl(this.user.street, [Validators.required]),
          houseNumber: new FormControl(this.user.houseNumber, [Validators.required, this.houseNumberValidator]),
          postalCode: new FormControl(this.user.postalCode, [Validators.required, this.postalCodeValidator]),
          city: new FormControl(this.user.city, [Validators.required]),
          country: new FormControl(this.user.country, [Validators.required]),
          password: new FormControl(this.user.lastName, [Validators.required, this.validPassword]),
          tags: new FormControl(this.user.tags),
          profilePicture: new FormControl(this.user.profilePicture, [Validators.required])
        });
      });
    });
  }

  save(): void {
    console.log("Saving user");

    this.userService.update(this.user, this.user.id).subscribe((updated) => {
      if (updated) {
        console.log(updated);
        this.router.navigate(['/profile']);
      }
    });
  }

  getAllTags(): void {
    this.userService.getDistinctTagsForAllUsers().subscribe((result) => {
      for (const tag of result) {
        this.allTags.push(tag);
      }
    });
  }

  validEmail(control: FormControl): { [key: string]: any } | null {
    const email = control.value;
    const regexp = /^[a-zA-Z\d]+@[a-zA-Z]+\.[a-zA-Z]+$/;
    return regexp.test(email) ? null : { invalidEmail: true };
  }
  
  validPassword(control: FormControl): { [s: string]: boolean } | null {
    const password = control.value;
    if (!password) {
      return null;
    }
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
    const regex = /^(?:[1-9]\d{3}\s?[a-zA-Z]{2}|[1-9]\d{3}|[1-9]\d{3}\s[a-zA-Z]{2})$/;
  
    return regex.test(postalCode) ? null : { invalidPostalCode: true };
  }
}