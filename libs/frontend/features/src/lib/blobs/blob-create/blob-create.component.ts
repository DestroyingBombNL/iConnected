import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BlobService } from '../../services/blob.service';
import { IBlob } from '@ihomer/shared/api';

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
  distinctTypes: string[] = [];
  selectedTypes: string[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private blobService: BlobService
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
  }

  ngOnInit(): void {
    this.blobService.getDistinctTypesForAllBlobs().subscribe(
      (response: any) => {
        this.distinctTypes = response.results;
        console.log('Distinct Types for All Blobs:', this.distinctTypes);
      },
      (error: any) => {
        console.error('Error fetching distinct types:', error);
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

  createBlob(): void {
    console.log('create Blob aangeroepen');

    if (this.newBlob.valid) {
      const formData = this.newBlob.value;

      formData.types = this.selectedTypes;
      this.blobService.create(formData).subscribe({
        next: (createdBlob) => {
          console.log('Blobr created successfully:', createdBlob);
          this.router.navigate(['/blobs']);
        },
        error: (error) => {
          console.error('Error creating bende:', error);
        },
      });

      this.newBlob.reset();
    }
  }

  goBack(): void {
    this.router.navigate(['/blobs']);
  }
}
