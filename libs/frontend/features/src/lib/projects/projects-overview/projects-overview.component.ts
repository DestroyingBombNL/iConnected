import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service'; // Import the user service
import { IBende, IBlob, IProject, IUser } from '@ihomer/shared/api';
import { Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ihomer-projects-overview',
  templateUrl: './projects-overview.component.html',
  styleUrls: ['./projects-overview.component.css'],
})
export class ProjectsOverviewComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  projects: IProject[] = [];
  popUpProjects: IProject[] = [];
  blobs: IBlob[] = [];
  bendes: IBende[] = [];
  users: IUser[] = []; // Initialize users array
  specificProject = {} as IProject;
  specificUser = {} as IUser;
  subscription: Subscription | null = null;
  darkroof?: string;
  lightdoor?: string;
  cloudImage?: string;
  blueskyImage?: string;
  grassImage?: string;
  closeResult = '';

  constructor(private projectService: ProjectService, private userService: UserService) {
    this.darkroof = 'assets/dark-roof.png';
    this.lightdoor = 'assets/whitedoor.png';
    this.cloudImage = 'assets/cloudImage.jpg';
    this.blueskyImage = 'assets/bluesky.png';
    this.grassImage = 'assets/grassImage.jpg';
  }

  ngOnInit() {
    this.subscription = this.projectService.readAll().subscribe((results) => {
      if (results !== null) {
        this.projects = results.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
    });

    // Fetch user data when the component initializes
    this.userService.readAll().subscribe((users) => {
      if (users !== null) {
        this.users = users;
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  open(content: TemplateRef<any>, projectId: string) {
    this.specificProject = this.projects.find((b) => b.id === projectId) as IProject;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-project-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          console.log('closed');
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          console.log('dismissed');
        }
      );
  }

  openUser(content: TemplateRef<any>, userId: string) {
    // Ensure that users array is populated
    if (this.users.length > 0) {
      this.specificUser = this.users.find((u) => u.id === userId) as IUser;

      this.userService.getProfile(userId).subscribe((profile) => {
        if (profile.blobs) {
          this.blobs = profile.blobs;
        }
        if (profile.bendes) {
          this.bendes = profile.bendes;
        }
        if (profile.projects) {
          this.popUpProjects = profile.projects;
        }
      });

      this.modalService
        .open(content, { ariaLabelledBy: 'modal-user-title' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
            console.log('closed');
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            console.log('dismissed');
          }
        );
    }
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  getProjectsInRows(): any[][] {
    const projectsInRows = [];
    for (let i = 0; i < this.projects.length; i += 3) {
      projectsInRows.push(this.projects.slice(i, i + 3));
    }
    return projectsInRows;
  }

  calculateColumnClass(totalRooms: number): string {
    switch (totalRooms) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-6';
      case 3:
        return 'col-4';
      default:
        return 'col'; // default to equal width columns for other cases
    }
  }
}
