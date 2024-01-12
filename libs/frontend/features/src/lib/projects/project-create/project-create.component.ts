import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { IProject, IUser } from '@ihomer/shared/api';
import { UserService } from '../../services/user.service';

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
  users: IUser[] = []; // List of available users
  selectedUsers: IUser[] = []; // List of selected users
  userNames: string[] = []; // List of user names
  spcProject: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.backgroundImage = '/assets/backgroundiHomer.png';
    this.newProject = new FormGroup({
      name: new FormControl('', [Validators.required]),
      creationDate: new FormControl(''),
      slack: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
      users: new FormControl([]),
    });
    this.spcProject = new FormGroup({
      name: new FormControl('', [Validators.required]),
      creationDate: new FormControl(''),
      slack: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
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

    this.route.paramMap.subscribe((params) => {
      this.projectService.readOne(params.get('id')).subscribe((project) => {
        if (!params.get('id')) return;
        console.log("Project:", project.name);
        this.project = project;
        this.spcProject = new FormGroup({
          name: new FormControl(this.project.name, [ 
            Validators.required,
          ]),
          slack: new FormControl(this.project.slack, [
            Validators.required
          ]),
          image: new FormControl(this.project.image, [Validators.required]),
        });
      });
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  createProject(): void {
    console.log('create Project aangeroepen');

    if (this.newProject.valid) {
      const formData = this.newProject.value;

      formData.users = this.selectedUsers;
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

  onUserSelectionChanged(selectedUsers: IUser[]) {
    this.selectedUsers = selectedUsers;
    console.log('Selected Users:', this.selectedUsers);
    console.log('Selected User ids:', this.selectedUsers.map((user) => user.id));
  }

  changeProject(id: string): void {
    console.log('change Project aangeroepen');

    if (this.spcProject.valid) {
      const formData = this.spcProject.value;

      this.projectService.update(formData, id).subscribe({
        next: (updatedProject) => {
          console.log('Project updated successfully:', updatedProject);
          this.router.navigate(['/projects']);
        },
        error: (error) => {
          console.error('Error updating project:', error);
        },
      });

      this.spcProject.reset();
    }
  }

  goBack(): void {
    this.router.navigate(['/projects']);
  }
}