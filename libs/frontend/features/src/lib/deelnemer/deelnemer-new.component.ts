import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { IUser } from '@ihomer/shared/api';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ihomer-new-deelnemer',
  templateUrl: 'deelnemer-new.component.html',
  styleUrls: ['./deelnemer-new.component.css'],
})

export class DeelnemerNewComponent implements OnInit {
    user = {} as IUser;
    users: IUser[] = [];
    subscription: Subscription | null = null;

    constructor( 
      private userService: UserService,
      private router: Router, 
    ) {}

    ngOnInit(): void {
        this.subscription = this.userService.readAllUsers().subscribe((results) =>{
            if (results !== null) {
                this.users = results;
            }
        });
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
}