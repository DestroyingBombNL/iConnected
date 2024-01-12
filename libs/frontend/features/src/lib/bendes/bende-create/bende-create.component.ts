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
  spcBende: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private bendeService: BendeService,
    private route: ActivatedRoute
  ) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
    this.newBende = new FormGroup({
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
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.bendeService.readOne(params.get('id')).subscribe((bende) => {
        if (!this.bendeService) return;
        this.bende = bende;
        this.spcBende = new FormGroup({
          name: new FormControl(this.bende.name, [ 
            Validators.required,
          ]),
          slack: new FormControl(this.bende.slack, [
            Validators.required
          ]),
          image: new FormControl(this.bende.image, [Validators.required]),
        });
      console.log("Bende2: ",this.bende.name);
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  createBende(): void {
    console.log('create Bende aangeroepen');

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

  changeBende(id: string): void {
    console.log('change Bende aangeroepen');

    if (this.spcBende.valid) {
      const formData = this.spcBende.value;

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

  goBack(): void {
    this.router.navigate(['/bendes']);
  }
}
