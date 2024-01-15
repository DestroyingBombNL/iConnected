import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '@ihomer/api';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'ihomer-update-profile',
  templateUrl: './update-profile.component.html', 
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit {
  user!: IUser;
  userForm!: FormGroup; 
  allTags = new BehaviorSubject<string[]>([]);

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
      });
    });
  }

  save(): void {
    this.userService.update(this.user, this.user.id).subscribe((updated) => {
      if (updated) {
        console.log(updated);
        this.router.navigate(['/profile']);
      }
    });
  }

  getAllTags(): void {
    this.userService.getDistinctTagsForAllUsers().subscribe((result) => {
      // for (const tag of result) {
      //   this.allTags.push(tag);
      // }
      // console.log("Got new tags: ", this.allTags);
      this.allTags.next(result);
    });
  }

  validEmail(control: FormControl): { [key: string]: any } | null {
    const email = control.value;
    const regexp = /^[a-zA-Z\d]+@[a-zA-Z]+\.[a-zA-Z]+$/;
    return regexp.test(email) ? null : { invalidEmail: true };
  }
  
  validatePassword(): ValidatorFn {
    return (control:AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:'",.<>?/|\\[\]`~])(?!.*\s).{8,}$/;
      return regexp.test(value) ? { invalidPassword: true } : null;
    }
  }

  houseNumberValidator(control: FormControl): { [s: string]: boolean } | null {
    const houseNumber = control.value;
    const regexp = /^[1-9]\d{0,4}([a-zA-Z]{1,2})?$/;

    return regexp.test(houseNumber) ? null : { invalidhouseNumber: true };
  }

  valiDate(): ValidatorFn {
    return (control:AbstractControl): ValidationErrors | null => {
      const value = new Date(control.value);
      const currentDate = new Date();
      const minDate = new Date(1900, 1, 1);

      if (value > currentDate) {
        return { dateInFuture: true };
      }

      if (value < minDate) {
        return { dateBefore1900: true };
      }

      return null;
    }
  }

  postalCodeValidator(control: FormControl): { [s: string]: boolean } | null {
    const postalCode = control.value;
    const regex = /^(?:[1-9]\d{3}\s?[a-zA-Z]{2}|[1-9]\d{3}|[1-9]\d{3}\s[a-zA-Z]{2})$/;
  
    return regex.test(postalCode) ? null : { invalidPostalCode: true };
  }
}