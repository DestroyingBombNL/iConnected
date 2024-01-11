import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IUser } from '@ihomer/shared/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'ihomer-register-deelnemer',
  templateUrl: './deelnemer-register.component.html',
  styleUrls: ['./deelnemer-register.component.css'],
})

export class RegisterComponent implements OnInit {
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
        firstName: ['', [Validators.required]],
        infix: [''],
        lastName: ['', [Validators.required]],
        birthday: ['', [Validators.required, this.dateValidator]],
        email: ['', [Validators.required, this.validEmail]],
        street: ['', [Validators.required]],
        houseNumber: ['', [Validators.required, this.houseNumberValidator]],
        postalCode: ['', [Validators.required, this.postalCodeValidator]],
        city: ['', [Validators.required]],
        password: ['', [Validators.required, this.validPassword]],
        tags: [[]]
      });

      this.backgroundImage = '/assets/backgroundiHomer.png';
    }

    ngOnInit(): void {
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

    onTagSelectionChanged(tags: any) {
      this.selectedTags = tags;
    }

    createUser(): void {
      console.log("create User aangeroepen");
    
      if (this.newDeelnemer.valid) {
        const formData = this.newDeelnemer.value;
        
        formData.tags = this.selectedTags;
        this.userService.create(formData).subscribe({
          next: (createdUser) => {
            console.log('User created successfully:', createdUser);
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Error creating user:', error);
          },
        });
    
        this.newDeelnemer.reset();
      }
    }

    goBack(): void {
      this.router.navigate(['/']);
    }

    validEmail(control: FormControl): { [s: string]: boolean } | null {
      const email = control.value;
      const regexp = /^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
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
  
      const regex = /^(?:(?:[1-9]\d{3})\s?[a-zA-Z]{2}|(\d{4}[a-zA-Z]{2})|(\d{4}))$/;
  
      return regex.test(postalCode) ? null : { invalidPostalCode: true };
    }
}