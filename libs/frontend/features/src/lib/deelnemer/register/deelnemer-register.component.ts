import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { IUser } from '@ihomer/shared/api';

@Component({
  selector: 'ihomer-login',
  templateUrl: './deelnemer-register.component.html',
  styleUrls: ['./deelnemer-register.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, [Validators.required]],
  });;
  submitted = false;
  subscription: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    console.log(this,this.router.getCurrentNavigation());
    this.subscription = this.authService
      .getUserFromLocalStorage()
      .subscribe((user: IUser | null) => {
        if (!user) {
          console.log('No user found in local storage');
        }
      });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.submitted = true;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      this.authService
        .login(email, password)
        .subscribe((user: void | IUser | null) => {
          if (user) {
            console.log('Logged in');
            this.router.navigate(['/deelnemers']);
          }
          this.submitted = false;
        });
    } else {
      this.submitted = false;
      console.error('loginForm invalid');
    }
  }

  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      this.submitted = true;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;

      this.subscription = this.authService.login(email, password).subscribe(
        (user: void | IUser | null) => {
          if (user) {
            console.log('Logged in');
            this.router.navigate(['/deelnemers']);
          }
          this.submitted = false;
        },
        (error) => {
          console.error('Error during login:', error);
          this.submitted = false;
        }
      );
    } else {
      this.submitted = false;
      console.error('loginForm invalid');
    }
  }

  validEmail(control: FormControl): { [s: string]: boolean } | null {
    const email = control.value;
    const regexp = new RegExp(
      '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
    );
    return regexp.test(email) ? null : { email: false };
  }

  validPassword(control: FormControl): { [s: string]: boolean } | null {
    const password = control.value;
    const regexp = new RegExp('^[a-zA-Z]([a-zA-Z0-9]){2,14}');
    return regexp.test(password) ? null : { password: false };
  }

  ngOnDestroy(): void {
    // Unsubscribe from subscriptions to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}