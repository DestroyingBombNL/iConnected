import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { BlobService } from '../../services/blob.service';
import { UserService } from '../../services/user.service'; // Import the user service
import { IBende, IBlob, IProject, IUser } from '@ihomer/shared/api';
import { Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ihomer-blobs-overview',
  templateUrl: './blobs-overview.component.html',
  styleUrls: ['./blobs-overview.component.css'],
})
export class BlobsOverviewComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  users: IUser[] = []; // Initialize users array
  specificBlob = {} as IBlob;
  specificUser = {} as IUser;
  blobs: IBlob[] = [];
  popUpBlobs: IBlob[] = [];
  bendes: IBende[] = [];
  projects: IProject[] = [];
  subscription: Subscription | null = null;
  darkroof?: string;
  lightdoor?: string;
  cloudImage?: string;
  grassImage?: string;
  closeResult = '';

  constructor(
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
  const blobsWithSameSize = blobRow.filter(blob => {
    if (currentBlobUserCount <= 6) {
      return blob.users.length <= 6;
    } else if (currentBlobUserCount <= 9) {
      return blob.users.length > 6 && blob.users.length <= 9;
    } else {
      return blob.users.length > 9;
    }
  });

  if (currentBlobUserCount <= 6) {
    columnClass = blobsWithSameSize.length === 1 ? 'col-12' : blobsWithSameSize.length === 2 ? 'col-6' : 'col-4';
  } else if (currentBlobUserCount <= 9) {
    columnClass = blobsWithSameSize.length === 1 ? 'col-12' : 'col-6';
  } else {
    columnClass = 'col-12';
  }

  return columnClass;
}
}
