import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { IProject } from '@ihomer/shared/api';

@Component({
  selector: 'ihomer-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.css'],
})
export class ProjectCreateComponent implements OnInit, OnDestroy {
  backgroundImage?: string;
  project = {} as IProject;
  projects: IProject[] = [];
  subscription: Subscription | null = null;
  newProject: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService
  ) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
    this.newProject = new FormGroup({
      name: new FormControl('', [Validators.required]),
      creationDate: new FormControl(''),
      slack: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      users: new FormControl([]),
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  createProject(): void {
    console.log('create Project aangeroepen');

    if (this.newProject.valid) {
      const formData = this.newProject.value;

      this.projectService.create(formData).subscribe({
        next: (createdProject) => {
          console.log('Project created successfully:', createdProject);
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('Error creating project:', error);
        },
      });

      this.newProject.reset();
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}