import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin } from '@ihomer/shared/api';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ihomer-login-deelnemer',
  templateUrl: './deelnemer-login.component.html', 
  styleUrls: ['./deelnemer-login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm!: FormGroup;
  subs: Subscription | undefined;
  submitted = false;
  backgroundImage?: string;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
  }

  controls() {
    return this.loginForm.controls;
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl("", [ Validators.required, this.validEmail.bind(this) ]),
      password: new FormControl("", [ Validators.required, this.validPassword.bind(this) ]),
    });
    console.log(this.authService.getUserFromLocalStorage());
    /*
    if (this.authService.getUserFromLocalStorage()) {
      this.router.navigate(['/']);
    }*/
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.loginForm?.valid) {
      this.submitted = true;
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const login: ILogin = {
        emailAddress: email,
        password: password
      }
      this.authService
        .login(login.emailAddress, login.password)
        .subscribe((user) => {
          if (user) {
            this.router.navigate(['/blobs']);
          }
          this.submitted = false;
        });
    } else {
      this.submitted = false;
    }
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
}