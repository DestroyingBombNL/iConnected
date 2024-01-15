import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BendeService } from '../../services/bende.service';
import { IBende, IUser } from '@ihomer/shared/api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'ihomer-bende-create',
  templateUrl: './bende-create.component.html',
  styleUrls: ['./bende-create.component.css'],
})
export class BendeCreateComponent implements OnInit, OnDestroy {
  backgroundImage?: string;
  bende = {} as IBende;
  bendes: IBende[] = [];
  subscription: Subscription | null = null;
  newBende: FormGroup;
  spcBende: FormGroup;
  users: IUser[] = []; // List of available users
  selectedUsers: IUser[] = []; // List of selected users
  userNames: string[] = []; // List of user names

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private bendeService: BendeService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
    this.newBende = this.formBuilder.group({
      name: new FormControl('', [Validators.required]),
      creationDate: new FormControl(''),
      slack: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      users: new FormControl([]),
    });
    this.spcBende = new FormGroup({
      name: new FormControl('', [Validators.required]),
      creationDate: new FormControl(''),
      slack: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      users: new FormControl([]),
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (!params.get('id')) return;
      this.bendeService.readOne(params.get('id')).subscribe((bende) => {
        if (!this.bendeService) return;
        this.bende = bende;
        this.spcBende = new FormGroup({
          name: new FormControl(this.bende.name, [Validators.required]),
          slack: new FormControl(this.bende.slack, [Validators.required]),
          image: new FormControl(this.bende.image, [Validators.required]),
          users: new FormControl(this.bende.users),
        });
        console.log('Bende2: ', this.bende.name);

        this.spcBende.get('users')?.setValue(this.bende.users);
      });
    });

    this.userService.readAll().subscribe(
      (users) => {
        if (users !== null) {
          this.users = users;
          this.userNames = users.map(
            (user) => user.firstName + ' ' + user.lastName
          );
          console.log('Users:', this.users);
        }
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  compareUsers(user1: any, user2: any): boolean {
    return user1 && user2 && user1.id === user2.id;
  }

  createBende(): void {
    console.log('create Bende aangeroepen');

    if (this.newBende.valid) {
      const formData = this.newBende.value;

      formData.users = this.selectedUsers;
      this.bendeService.create(formData).subscribe({
        next: (createdBende) => {
          console.log('Bende created successfully:', createdBende);
          this.router.navigate(['/bendes']);
        },
        error: (error) => {
          console.error('Error creating bende:', error);
        },
      });

      this.newBende.reset();
    }
  }

  changeBende(id: string): void {
    console.log('change Bende aangeroepen');

    if (this.spcBende.valid) {
      const formData = this.spcBende.value;

      formData.users = this.selectedUsers;
      console.log('FormData:', formData); // Log the form data for debugging
      this.bendeService.update(formData, id).subscribe({
        next: (updatedBende) => {
          console.log('Bende updated successfully:', updatedBende);
          this.router.navigate(['/bendes']);
        },
        error: (error) => {
          console.error('Error updating bende:', error);
        },
      });

      this.spcBende.reset();
    }
  }

  onUserSelectionChanged(selectedUsers: IUser[]) {
    this.selectedUsers = selectedUsers;
    console.log('Selected Users:', this.selectedUsers);
    console.log(
      'Selected User ids:',
      this.selectedUsers.map((user) => user.id)
    );
  }

  goBack(): void {
    this.router.navigate(['/bendes']);
  }
}
