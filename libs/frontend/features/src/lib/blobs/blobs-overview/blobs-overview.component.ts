import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { BlobService } from '../../services/blob.service';
import { UserService } from '../../services/user.service';
import { IBende, IBlob, IProject, IUser, Type } from '@ihomer/shared/api';
import { Subscription, debounceTime } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'ihomer-blobs-overview',
  templateUrl: './blobs-overview.component.html',
  styleUrls: ['./blobs-overview.component.css'],
})
export class BlobsOverviewComponent implements OnInit, OnDestroy {
  private currentInputValue: string = '';
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
  closeResult = '';
  roomsLayout: number[][] = [[], [], []];
  roomsLayoutNothing: number[][] = [[], [], []];

  constructor(
    private filterService: FilterService,
    private blobService: BlobService,
    private userService: UserService
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
          return a.users.length - b.users.length;
        });
        this.calculateBlobLayout(this.blobs);
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
      this.subscription = this.blobService.readAll().subscribe((results) => {
        if (results !== null) {
          this.blobs = results.sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        }
      });
    }
  }

  onSearchAction(event: Event): void {
    if ((<HTMLInputElement>event.target).value == '') {
      console.log('click');
      this.subscription = this.blobService.readAll().subscribe((results) => {
        if (results !== null) {
          this.blobs = results.sort((a, b) => {
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

  calculateBlobLayout(blobs: IBlob[]): void {
    console.log(blobs.length);
    const lastBlob: IBlob = {
      users: [],
      id: '',
      name: '',
      creationDate: new Date(),
      slack: '',
      mandate: '',
      type: Type.Bestuur,
      image: '',
      gradient: []
    };
    blobs.push(lastBlob);
    console.log(blobs.length)
    let x = 0;
    let y = 0;
    blobs.forEach((blob) => {
      if (x > 2) {
        x = 0;
        y++;
      }
      if ((this.roomsLayout[0][y - 1] + this.roomsLayout[1][y - 1] + this.roomsLayout[2][y - 1]) > 12) {
        if (this.roomsLayout[2][y - 1] != undefined) {
          this.roomsLayout[0][y] = this.roomsLayout[2][y - 1];
          this.roomsLayout[2][y - 1] = 0;
          this.roomsLayout[1][y - 1] = 12 - this.roomsLayout[0][y - 1];
          x = 1;
        } else if (this.roomsLayout[1][y - 1] != undefined) {
          this.roomsLayout[0][y + 1] = this.roomsLayout[1][y];
          this.roomsLayout[1][y] = 0;
          this.roomsLayout[1][y] = 12;
          x = 1;
          y++;
        } else {
          this.roomsLayout[0][y] = 12;
        }
      }
      if (blob.users.length == 0) {
        if ((this.roomsLayout[0][y] + this.roomsLayout[1][y]) > 12) {
          this.roomsLayout[0][y + 1] = this.roomsLayout[1][y]
          this.roomsLayout[1][y] = 0;
          this.roomsLayout[2][y] = 0;
          this.roomsLayout[1][y + 1] = 0;
          this.roomsLayout[2][y + 1] = 0;
          this.roomsLayout[0][y] = 12;
        }
      } else if (blob.users.length <= 3) {
        this.roomsLayout[x][y] = 4
      } else if (blob.users.length <= 6 ) {
        this.roomsLayout[x][y] = 6
      } else {
        this.roomsLayout[x][y] = 12
      }
      blob.lgSize += (this.roomsLayout[x][y]).toString();
      x++;
    })

    for (let i = 0; i < this.roomsLayout[0].length; i++) {
      let rowLog = "Row " + (i + 1) + ": ";
      for (let j = 0; j < this.roomsLayout.length; j++) {
          rowLog += this.roomsLayout[j][i] + " ";
      }
      console.log(rowLog.trim());
    }
    for (let i = 0; i < this.roomsLayoutNothing[0].length; i++) {
      let rowLog = "Row " + (i + 1) + ": ";
      for (let j = 0; j < this.roomsLayoutNothing.length; j++) {
          rowLog += this.roomsLayoutNothing[j][i] + " ";
      }
      console.log(rowLog.trim());
    }
    console.log(this.roomsLayout[0].length)
    console.log(this.roomsLayout[0][0]);
  }

  getBlobsInRows(): any[][] {
    return this.roomsLayout;
  }

  calculateColumnClass(blobRow: any[], blobIndex: number): string {
    return '';
  }

  getColumnIndex(): number {
    return 0;
  }

  addColumnSizeToBlob(): void {
    this.blobs.forEach((blob) => {
      blob.lgSize += 
    })
  }
  /*

  getBlobsInRows(): any[][] {
    const blobsInRows = [];
    for (let i = 0; i < this.blobs.length; i += 3) {
      blobsInRows.push(this.blobs.slice(i, i + 3));
    }
    return blobsInRows;
  }

  calculateColumnClass(blobRow: any[], blobIndex: number): string {
    const currentBlobUserCount = blobRow[blobIndex].users.length;

    if (currentBlobUserCount <= 3) {
      this.sizeHelper += 4;
      this.sizeHelper(4);
        return 'col-4';
    } else if (currentBlobUserCount <= 6) {
      this.sizeHelper += 6;
        return 'col-6';
    } else {
      this.sizeHelper += 4;

        return 'col-12';
    }
  }

  }*/
}