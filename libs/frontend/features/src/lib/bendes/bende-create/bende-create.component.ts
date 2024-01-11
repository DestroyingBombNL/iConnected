import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BendeService } from '../../services/bende.service';
import { IBende } from '@ihomer/shared/api';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private bendeService: BendeService
  ) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
    this.newBende = new FormGroup({
      name: new FormControl('', [Validators.required]),
      creationDate: new FormControl(''),
      slack: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      users: new FormControl([]),
    });
  }

  ngOnInit(): void {}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  createBende(): void {
    console.log("create Bende aangeroepen");
  
    if (this.newBende.valid) {
      const formData = this.newBende.value;
      
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

  goBack(): void {
    this.router.navigate(['/bendes']);
  }
}
