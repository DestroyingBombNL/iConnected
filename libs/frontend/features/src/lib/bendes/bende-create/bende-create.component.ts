import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ihomer-bende-create',
  templateUrl: './bende-create.component.html',
  styleUrls: ['./bende-create.component.css'],
})
export class BendeCreateComponent implements OnInit, OnDestroy {
  backgroundImage?: string;

  constructor(private router: Router) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
  }

  ngOnInit() {}

  ngOnDestroy() {}

  goBack(): void {
    this.router.navigate(['/bendes']);
  }
}
