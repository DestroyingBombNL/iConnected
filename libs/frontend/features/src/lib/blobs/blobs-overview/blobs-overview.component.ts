import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { BlobService } from '../../services/blob.service';
import { UserService } from '../../services/user.service';
import { IBende, IBlob, IProject, IUser } from '@ihomer/shared/api';
import { Subscription, debounceTime, forkJoin } from 'rxjs';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '../../services/filter.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'ihomer-blobs-overview',
  templateUrl: './blobs-overview.component.html',
  styleUrls: ['./blobs-overview.component.css'],
})
export class BlobsOverviewComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  ids: string[] = [];
  blobs: IBlob[] = [];
  users: IUser[] = [];
  data: string = 'Initial Data';
  highlightedIds: Set<string> = new Set<string>();
  specificBlob = {} as IBlob;
  specificUser = {} as IUser;
  popUpBlobs: IBlob[] = [];
  bendes: IBende[] = [];
  projects: IProject[] = [];
  subscription: Subscription | null = null;
  darkroof?: string;
  lightdoor?: string;
  cloudImage?: string;
  grassImage?: string;
  tags: string[] = [];
  selectedTag: string | null = null;
  closeResult = '';

  constructor(
    private filterService: FilterService,
    private blobService: BlobService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.darkroof = 'assets/dark-roof.png';
    this.lightdoor = 'assets/whitedoor.png';
    this.cloudImage = 'assets/cloudImage.png';
    this.grassImage = 'assets/grassImage.png';
  }

  ngOnInit() {
    this.subscription = this.blobService.readAll().subscribe((results) => {
      if (results !== null) {
        this.blobs = results.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      }
    });
    this.userService.readAll().subscribe((users) => {
      if (users !== null) {
        this.users = users;
      }
    });
    forkJoin([
      this.userService.getDistinctTagsForAllUsers(),
      this.filterService.getFilterTags()
    ]).subscribe(([userTags, filterTags]) => {
      if (userTags !== null) {
        this.tags = userTags;
        this.tags.push(...filterTags)
      }
    });
    
  }

  onSearchInput(event: Event): void {
    console.log("onSearchInput")
    console.log((<HTMLInputElement>event.target).value)
    if ((<HTMLInputElement>event.target).value == '') {
      this.subscription = this.blobService.readAll().subscribe((results) => {
        if (results !== null) {
          this.blobs = results.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }
      });
    } else {
      this.selectedTag = (<HTMLInputElement>event.target).value;
    }
  }

  onSearchAction(event: Event): void {
    console.log("onSearchAction")
    this.searchElements(this.selectedTag);
  }

  onClear(event: Event): void {
    console.log("onClear")
    if (this.selectedTag == '' || this.selectedTag == null) {
      this.subscription = this.blobService.readAll().subscribe((results) => {
        if (results !== null) {
          this.blobs = results.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }
      });
    }
  }

  onClick(event: Event): void {
    console.log("onClick")
  }

  onSearchButtonClick(): void {
    console.log('Selected Tag:', this.selectedTag);
    this.searchElements(this.selectedTag);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  searchElements(searchText: string | null): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (searchText === '' || searchText == null) {
      this.clearSearchResults();
      return;
    }
    let newBlobs: IBlob[] = [];
    this.subscription = this.blobService
      .readAll()
      .pipe(debounceTime(1000))
      .subscribe((results) => {
        if (results !== null) {
          newBlobs = results.sort((a, b) => {
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
        newBlobs.forEach((blob) => {
          blob.gradient =
            blob.users.some((user) => this.ids.includes(user.id)) &&
            (blob.type
              .toString()
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
              blob.slack.toLowerCase().includes(searchText.toLowerCase()) ||
              blob.mandate.toLowerCase().includes(searchText.toLowerCase()) ||
              blob.name.toLowerCase().includes(searchText.toLowerCase()) ||
              blob.creationDate
                .toString()
                .toLowerCase()
                .includes(searchText.toLowerCase()))
              ? ['#FFF275', '#F2FEDC']
              : ['#b9adad', '#b9adad'];

          blob.users.forEach((user) => {
            user.opacity = this.ids.includes(user.id) ? 1 : 0.4;
            user.border = this.ids.includes(user.id) ? '0.3rem' : '0px';
          });
          blob.users.sort((a, b) => b.opacity - a.opacity);
          this.blobs = newBlobs;
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

  calculateGradient(blob: any): string {
    if (blob.gradient && blob.gradient.length >= 2) {
      const gradientString = `linear-gradient(to bottom, ${blob.gradient[0]}, ${blob.gradient[1]})`;
      return gradientString;
    } else {
      return 'linear-gradient(to right, #ffffff, #ffffff)';
    }
  }

  open(content: TemplateRef<any>, blobId: string) {
    this.specificBlob = this.blobs.find((b) => b.id === blobId) as IBlob;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-blob-title' })
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
        if (profile.blobs) {
          this.popUpBlobs = profile.blobs;
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

  getBlobsInRows(): any[][] {
    const blobsInRows = [];
    for (let i = 0; i < this.blobs.length; i += 3) {
      blobsInRows.push(this.blobs.slice(i, i + 3));
    }
    return blobsInRows;
  }

  calculateColumnClass(blobRow: any[], blobIndex: number): string {
    let columnClass = 'col';

    const currentBlobUserCount = blobRow[blobIndex].users.length;
    const blobsWithSameSize = blobRow.filter((blob) => {
      if (currentBlobUserCount <= 6) {
        return blob.users.length <= 6;
      } else if (currentBlobUserCount <= 9) {
        return blob.users.length > 6 && blob.users.length <= 9;
      } else {
        return blob.users.length > 9;
      }
    });

    if (currentBlobUserCount <= 6) {
      columnClass =
        blobsWithSameSize.length === 1
          ? 'col-12'
          : blobsWithSameSize.length === 2
          ? 'col-6'
          : 'col-4';
    } else if (currentBlobUserCount <= 9) {
      columnClass = blobsWithSameSize.length === 1 ? 'col-12' : 'col-6';
    } else {
      columnClass = 'col-12';
    }

    return columnClass;
  }
  
  openDeleteBlob(content: TemplateRef<any>, blobId: string) {
    this.specificBlob = this.blobs.find((b) => b.id === blobId) as IBlob;

    this.modalService
      .open(content, { ariaLabelledBy: 'modal-blob-title' })
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

  closeBlobDetailModal(modal: NgbModalRef) {
    modal.close();
  }

  deleteBlob(blobId: string) {
    this.blobService.delete(this.specificBlob.id).subscribe((result) => {
      if (result) {
        this.blobs = this.blobs.filter((b) => b.id !== blobId);
      }
    });
  }

  isAuthenticated(): boolean {
    if (this.authService.isAdmin) return true;
    else return false;
  }
}
