import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { BendeService } from '../../services/bende.service';
import { UserService } from '../../services/user.service';
import { IBende, IBlob, IProject, IUser } from '@ihomer/shared/api';
import { Subscription, debounceTime } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '../../services/filter.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ihomer-bendes-overview',
  templateUrl: './bendes-overview.component.html',
  styleUrls: ['./bendes-overview.component.css'],
})
export class BendesOverviewComponent implements OnInit, OnDestroy {
  private currentInputValue: string = '';
  private modalService = inject(NgbModal);
  ids: string[] = [];
  bendes: IBende[] = [];
  users: IUser[] = [];
  data: string = 'Initial Data';
  highlightedIds: Set<string> = new Set<string>();
  specificBende = {} as IBende;
  specificUser = {} as IUser;
  popUpBendes: IBende[] = [];
  Blobs: IBlob[] = [];
  projects: IProject[] = [];
  subscription: Subscription | null = null;
  darkroof?: string;
  lightdoor?: string;
  cloudImage?: string;
  grassImage?: string;
  closeResult = '';

  constructor(
    private filterService: FilterService,
    private bendeService: BendeService,
    private userService: UserService
    private authService: AuthService
  ) {
    this.darkroof = 'assets/dark-roof.png';
    this.lightdoor = 'assets/whitedoor.png';
    this.cloudImage = 'assets/cloudImage.png';
    this.grassImage = 'assets/grassImage.png';
  }

  ngOnInit() {
    this.subscription = this.bendeService.readAll().subscribe((results) => {
      if (results !== null) {
        this.bendes = results.sort((a, b) => {
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
      this.subscription = this.bendeService.readAll().subscribe((results) => {
        if (results !== null) {
          this.bendes = results.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }
      });
    }
  }

  onSearchAction(event: Event): void {
    if ((<HTMLInputElement>event.target).value == '') {
      console.log('click');
      this.subscription = this.bendeService.readAll().subscribe((results) => {
        if (results !== null) {
          this.bendes = results.sort((a, b) => {
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
    let newBendes: IBende[] = [];
    this.subscription = this.bendeService
      .readAll()
      .pipe(debounceTime(1000))
      .subscribe((results) => {
        if (results !== null) {
          newBendes = results.sort((a, b) => {
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
        newBendes.forEach((bende) => {
          bende.gradient =
            bende.users.some((user) => this.ids.includes(user.id)) &&
            (
              bende.slack.toLowerCase().includes(searchText.toLowerCase()) ||
              bende.name.toLowerCase().includes(searchText.toLowerCase()) ||
              bende.creationDate
                .toString()
                .toLowerCase()
                .includes(searchText.toLowerCase()))
              ? ['#FFF275', '#F2FEDC']
              : ['#b9adad', '#b9adad'];

          bende.users.forEach((user) => {
            user.opacity = this.ids.includes(user.id) ? 1 : 0.4;
            user.border = this.ids.includes(user.id) ? '0.3rem' : '0px';
          });
          bende.users.sort((a, b) => b.opacity - a.opacity);
          this.bendes = newBendes;
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

  calculateGradient(bende: any): string {
    if (bende.gradient && bende.gradient.length >= 2) {
      const gradientString = `linear-gradient(to bottom, ${bende.gradient[0]}, ${bende.gradient[1]})`;
      return gradientString;
    } else {
      return 'linear-gradient(to right, #ffffff, #ffffff)';
    }
  }

  open(content: TemplateRef<any>, bendeId: string) {
    this.specificBende = this.bendes.find((b) => b.id === bendeId) as IBende;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-bende-title' })
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
        if (profile.bendes) {
          this.popUpBendes = profile.bendes;
        }
        if (profile.bendes) {
          this.Blobs = profile.blobs;
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

  getBendesInRows(): any[][] {
    const bendesInRows = [];
    for (let i = 0; i < this.bendes.length; i += 3) {
      bendesInRows.push(this.bendes.slice(i, i + 3));
    }
    return bendesInRows;
  }

  calculateColumnClass(bendeRow: any[], bendeIndex: number): string {
    let columnClass = 'col';

    const currentBendeUserCount = bendeRow[bendeIndex].users.length;
    const bendesWithSameSize = bendeRow.filter((bende) => {
      if (currentBendeUserCount <= 6) {
        return bende.users.length <= 6;
      } else if (currentBendeUserCount <= 9) {
        return bende.users.length > 6 && bende.users.length <= 9;
      } else {
        return bende.users.length > 9;
      }
    });

    if (currentBendeUserCount <= 6) {
      columnClass =
        bendesWithSameSize.length === 1
          ? 'col-12'
          : bendesWithSameSize.length === 2
          ? 'col-6'
          : 'col-4';
    } else if (currentBendeUserCount <= 9) {
      columnClass = bendesWithSameSize.length === 1 ? 'col-12' : 'col-6';
    } else {
      columnClass = 'col-12';
    }

    return columnClass;
  }

  openDeleteBende(content: TemplateRef<any>, bendeId: string) {
    this.specificBende = this.bendes.find((b) => b.id === bendeId) as IBende;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-bende-title' })
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

  closeBendeDetailModal(modal: NgbModalRef) {
    modal.close();
  }

  deleteBende(bendeId: string) {
    this.bendeService.delete(this.specificBende.id).subscribe((result) => {
      if (result) {
        this.bendes = this.bendes.filter((b) => b.id !== bendeId);
      }
    });
  }

  isAuthenticated(): boolean {
    if (this.authService.isAdmin) return true;
    else return false;
  }
}
