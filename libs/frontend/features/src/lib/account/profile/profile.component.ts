import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ihomer-profile',
  templateUrl: './profile.component.html', 
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {

    constructor(
        private route: ActivatedRoute, 
        private router: Router, 
    ) {}


}