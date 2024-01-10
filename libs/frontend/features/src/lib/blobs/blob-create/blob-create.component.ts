import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ihomer-blob-create',
  templateUrl: './blob-create.component.html',
  styleUrls: ['./blob-create.component.css'],
})
export class BlobCreateComponent implements OnInit, OnDestroy {
  backgroundImage?: string;

  constructor(private router: Router) {
    this.backgroundImage = '/assets/backgroundiHomer.png'
  }

  ngOnInit() {}

  ngOnDestroy() {}

  goBack(): void {
    this.router.navigate(['/blobs']);
  }
}
