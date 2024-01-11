import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { BlobService } from '../../services/blob.service';
import { UserService } from '../../services/user.service';
import { IBlob, IUser } from '@ihomer/shared/api';
import { Subscription } from 'rxjs';
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
  subscription: Subscription | null = null;
  darkroof?: string;
  lightdoor?: string;
  cloudImage?: string;
  blueskyImage?: string;
  grassImage?: string;
  closeResult = '';

  constructor(private filterService: FilterService, private blobService: BlobService, private userService: UserService) {
    this.darkroof = 'assets/dark-roof.png';
    this.lightdoor = 'assets/whitedoor.png';
    this.cloudImage = 'assets/cloudImage.jpg';
    this.blueskyImage = 'assets/bluesky.png';
    this.grassImage = 'assets/grassImage.jpg';
  }

  ngOnInit() {
    console.log("ngOnInit");
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
  }

  onSearchInput(event: Event): void {
    console.log("onSearchInput");
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
    console.log("onSearchAction");
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
    console.log("onSearchButtonClick");
    this.searchElements(this.currentInputValue);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  searchElements(searchText: string): void {
    if (searchText === '') {
      this.clearSearchResults();
      return;
    }
  
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

    this.filterService.filter(searchText).subscribe((uuids) => {
      if (uuids !== null) {
        this.ids = uuids;
        this.blobs.forEach((blob) => {
          blob.gradient = (
            blob.users.some((user) => this.ids.includes(user.id)) &&
            (
              blob.type.toString().toLowerCase().includes(searchText.toLowerCase()) ||
              blob.slack.toLowerCase().includes(searchText.toLowerCase()) ||
              blob.mandate.toLowerCase().includes(searchText.toLowerCase()) ||
              blob.name.toLowerCase().includes(searchText.toLowerCase()) ||
              blob.creationDate.toString().toLowerCase().includes(searchText.toLowerCase())
            )
          )
            ? ["#FFF275", "#F2FEDC"]
            : ["lightgrey", "lightgrey"];
        
          blob.users.forEach((user) => {
            user.opacity = this.ids.includes(user.id) ? 1 : 0.4;
          });
          blob.users.sort((a, b) => b.opacity - a.opacity);
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

  calculateColumnClass(totalRooms: number): string {
    switch (totalRooms) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-6';
      case 3:
        return 'col-4';
      default:
        return 'col';
    }
  }
}
