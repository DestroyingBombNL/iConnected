import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BlobService } from '../../services/blob.service';
import { IBlob, IUser } from '@ihomer/shared/api';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'ihomer-blob-create',
  templateUrl: './blob-create.component.html',
  styleUrls: ['./blob-create.component.css'],
})
export class BlobCreateComponent implements OnInit, OnDestroy {
  backgroundImage?: string;
  blob = {} as IBlob;
  blobs: IBlob[] = [];
  subscription: Subscription | null = null;
  newBlob: FormGroup;
  spcBlob: FormGroup;
  distinctTypes: string[] = [];
  selectedTypes: string[] = [];
  users: IUser[] = []; // List of available users
  selectedUsers: IUser[] = []; // List of selected users
  userNames: string[] = []; // List of user names

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private blobService: BlobService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
    this.newBlob = this.formBuilder.group({
      name: ['', [Validators.required]],
      creationDate: [''],
      slack: ['', [Validators.required]],
      mandate: [''],
      type: [''],
      image: ['', [Validators.required]],
      users: [[]],
    });
    this.spcBlob = new FormGroup({
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
      this.blobService.readOne(params.get('id')).subscribe((blob) => {
        if (!this.blobService) return;
        this.blob = blob;
        this.spcBlob = new FormGroup({
          name: new FormControl(this.blob.name, [Validators.required]),
          slack: new FormControl(this.blob.slack, [Validators.required]),
          image: new FormControl(this.blob.image, [Validators.required]),
          users: new FormControl(this.blob.users),
        });
        console.log('blob: ', this.blob.name);

        this.spcBlob.get('users')?.setValue(this.blob.users);
      });
    });

    this.blobService.getDistinctTypesForAllBlobs().subscribe(
      (response: any) => {
        this.distinctTypes = response.results;
        console.log('Distinct Types for All Blobs:', this.distinctTypes);
      },
      (error: any) => {
        console.error('Error fetching distinct types:', error);
      }
    );

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

  onTypeSelectionChanged(types: any) {
    this.selectedTypes = types;
    console.log('Selected Types:', this.selectedTypes);
  }

  onUserSelectionChanged(selectedUsers: IUser[]) {
    this.selectedUsers = selectedUsers;
    console.log('Selected Users:', this.selectedUsers);
    console.log('Selected User ids:', this.selectedUsers.map((user) => user.id));
  }
  

  createBlob(): void {
    console.log('create Blob aangeroepen');

    if (this.newBlob.valid) {
      const formData = this.newBlob.value;

      formData.type = this.selectedTypes;
      formData.users = this.selectedUsers;

      console.log('FormData:', formData); // Log the form data for debugging
      console.log('FormData users:', formData.users); // Log the form data for debugging
      this.blobService.create(formData).subscribe({
        next: (createdBlob) => {
          console.log('Blobr created successfully:', createdBlob);
          this.router.navigate(['/blobs']);
        },
        error: (error) => {
          console.error('Error creating blob:', error);
        },
      });

      this.newBlob.reset();
    }
  }

  changeBlob(id: string): void {
    console.log('change Blob aangeroepen');

    if (this.spcBlob.valid) {
      const formData = this.spcBlob.value;

      formData.users = this.selectedUsers;
      console.log('FormData:', formData); // Log the form data for debugging
      this.blobService.update(formData, id).subscribe({
        next: (updatedBlob) => {
          console.log('Blobs updated successfully:', updatedBlob);
          this.router.navigate(['/blobs']);
        },
        error: (error) => {
          console.error('Error updating blobs:', error);
        },
      });

      this.spcBlob.reset();
    }
  }

  goBack(): void {
    this.router.navigate(['/blobs']);
  }
}
