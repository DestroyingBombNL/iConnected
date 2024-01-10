import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ihomer-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  backgroundImage?: string;

  constructor(private router: Router) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
  }

  ngOnInit() {}

  ngOnDestroy() {}

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}
