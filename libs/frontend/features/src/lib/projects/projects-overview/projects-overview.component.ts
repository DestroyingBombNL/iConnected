import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { IBende, IBlob, IProject, IUser } from '@ihomer/shared/api';
import { Subscription, debounceTime } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'ihomer-projects-overview',
  templateUrl: './projects-overview.component.html',
  styleUrls: ['./projects-overview.component.css'],
})
export class ProjectsOverviewComponent implements OnInit, OnDestroy {
  private currentInputValue: string = '';
  private modalService = inject(NgbModal);
  ids: string[] = [];
  projects: IProject[] = [];
  users: IUser[] = [];
  data: string = 'Initial Data';
  highlightedIds: Set<string> = new Set<string>();
  specificProject = {} as IProject;
  specificUser = {} as IUser;
  popUpProjects: IProject[] = [];
  bendes: IBende[] = [];
  blobs: IBlob[] = [];
  subscription: Subscription | null = null;
  darkroof?: string;
  lightdoor?: string;
  cloudImage?: string;
  grassImage?: string;
  closeResult = '';

  constructor(
    private filterService: FilterService,
    private projectService: ProjectService,
    private userService: UserService
  ) {
    this.darkroof = 'assets/dark-roof.png';
    this.lightdoor = 'assets/whitedoor.png';
    this.cloudImage = 'assets/cloudImage.png';
    this.grassImage = 'assets/grassImage.png';
  }

  ngOnInit() {
    this.subscription = this.projectService.readAll().subscribe((results) => {
      if (results !== null) {
        this.projects = results.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
    });
    this.userService.readAll().subscribe((users) => {
      if (users !== null) {
        this.users = users;
      }
    });
  }

  onSearchInput(event: Event): void {
    this.currentInputValue = (<HTMLInputElement>event.target).value;

    if (this.currentInputValue == '') {
      this.subscription = this.projectService.readAll().subscribe((results) => {
        if (results !== null) {
          this.projects = results.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }
      });
    }
  }

  onSearchAction(event: Event): void {
    if ((<HTMLInputElement>event.target).value == '') {
      console.log('click');
      this.subscription = this.projectService.readAll().subscribe((results) => {
        if (results !== null) {
          this.projects = results.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }
      });
    } else {
      console.log('enter');
      this.searchElements(this.currentInputValue);
    }
  }

  onSearchButtonClick(): void {
    this.searchElements(this.currentInputValue);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  searchElements(searchText: string): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (searchText === '') {
      this.clearSearchResults();
      return;
    }
    let newProjects: IProject[] = [];
    this.subscription = this.projectService
      .readAll()
      .pipe(debounceTime(1000))
      .subscribe((results) => {
        if (results !== null) {
          newProjects = results.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }
      });

    this.userService.readAll().subscribe((users) => {
      if (users !== null) {
        this.users = users;
      }
    });

    this.filterService.filter(searchText).subscribe((uuids) => {
      if (uuids !== null) {
        this.ids = uuids;
        newProjects.forEach((project) => {
          project.gradient =
            project.users.some((user) => this.ids.includes(user.id)) &&
            (
              project.slack.toLowerCase().includes(searchText.toLowerCase()) ||
              project.name.toLowerCase().includes(searchText.toLowerCase()) ||
              project.creationDate
                .toString()
                .toLowerCase()
                .includes(searchText.toLowerCase()))
              ? ['#FFF275', '#F2FEDC']
              : ['#b9adad', '#b9adad'];

          project.users.forEach((user) => {
            user.opacity = this.ids.includes(user.id) ? 1 : 0.4;
            user.border = this.ids.includes(user.id) ? '0.3rem' : '0px';
          });
          project.users.sort((a, b) => b.opacity - a.opacity);
          this.projects = newProjects;
        });
      }
    });
  }

  clearSearchResults(): void {
    const elements = document.querySelectorAll('house-contents');

    elements.forEach((element: Element) => {
      (element as HTMLElement).style.backgroundColor = '';
    });
  }

  isHighlighted(id: string): boolean {
    return this.highlightedIds.has(id);
  }

  calculateGradient(project: any): string {
    if (project.gradient && project.gradient.length >= 2) {
      const gradientString = `linear-gradient(to bottom, ${project.gradient[0]}, ${project.gradient[1]})`;
      return gradientString;
    } else {
      return 'linear-gradient(to right, #ffffff, #ffffff)';
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
    if (this.users.length > 0) {
      this.specificUser = this.users.find((u) => u.id === userId) as IUser;

      this.userService.getProfile(userId).subscribe((profile) => {
        if (profile.projects) {
          this.popUpProjects = profile.projects;
        }
        if (profile.bendes) {
          this.bendes = profile.bendes;
        }
        if (profile.projects) {
          this.projects = profile.projects;
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

  calculateColumnClass(projectRow: any[], projectIndex: number): string {
    let columnClass = 'col';

    const currentProjectUserCount = projectRow[projectIndex].users.length;
    const projectsWithSameSize = projectRow.filter((project) => {
      if (currentProjectUserCount <= 6) {
        return project.users.length <= 6;
      } else if (currentProjectUserCount <= 9) {
        return project.users.length > 6 && project.users.length <= 9;
      } else {
        return project.users.length > 9;
      }
    });

    if (currentProjectUserCount <= 6) {
      columnClass =
        projectsWithSameSize.length === 1
          ? 'col-12'
          : projectsWithSameSize.length === 2
          ? 'col-6'
          : 'col-4';
    } else if (currentProjectUserCount <= 9) {
      columnClass = projectsWithSameSize.length === 1 ? 'col-12' : 'col-6';
    } else {
      columnClass = 'col-12';
    }

    return columnClass;
  }
}
