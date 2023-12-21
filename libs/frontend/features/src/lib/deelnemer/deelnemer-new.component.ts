import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { IUser } from '@ihomer/shared/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ihomer-new-deelnemer',
  templateUrl: './deelnemer-new.component.html',
  styleUrls: ['./deelnemer-new.component.css'],
})

export class DeelnemerNewComponent implements OnInit {
    user = {} as IUser;
    users: IUser[] = [];
    subscription: Subscription | null = null;
    backgroundImage?: string;
    distinctTags: string[] = [];
    selectedTags: string[] = [];
    
    newDeelnemer: FormGroup;

    constructor( 
      private formBuilder: FormBuilder,
      private userService: UserService,
      private router: Router, 
    ) 
    {
      this.newDeelnemer = this.formBuilder.group({
        email: ['', [Validators.required, this.validEmail]],
        profilePicture: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        infix: [''],
        lastName: ['', [Validators.required]],
        birthDay: ['', [Validators.required, this.dateValidator]],
        street: ['', [Validators.required]],
        houseNumber: ['', [Validators.required, this.houseNumberValidator]],
        postalCode: ['', [Validators.required, this.postalCodeValidator]],
        city: ['', [Validators.required]],
        bio: [''],
        password: ['', [Validators.required, this.validPassword]]
      });

      this.backgroundImage = '/assets/backgroundiHomer.png';
    }

    ngOnInit(): void {
      this.userService.getDistinctTagsForAllUsers().subscribe(
        (response: any) => {
          // Assuming your response has a structure like { results: [...tags], info: {...} }
          this.distinctTags = response.results;
          console.log('Distinct Tags for All Users:', this.distinctTags);
        },
        (error: any) => {
          console.error('Error fetching distinct tags:', error);
        }
      );
    }

    createUser(): void {
      this.userService.create(this.user).subscribe({
        next: (createdUser) => {
          console.log('User created successfully:', createdUser);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });      
    }
  
    goBack(): void {
      this.router.navigate(['/']);
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