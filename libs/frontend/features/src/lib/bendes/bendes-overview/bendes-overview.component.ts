import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  TemplateRef,
} from '@angular/core';
import { BendeService } from '../../services/bende.service';
import { UserService } from '../../services/user.service'; // Import the user service
import { IBende, IUser } from '@ihomer/shared/api';
import { Subscription } from 'rxjs';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'ihomer-bendes-overview',
  templateUrl: './bendes-overview.component.html',
  styleUrls: ['./bendes-overview.component.css'],
})
export class BendesOverviewComponent implements OnInit, OnDestroy {
  private modalService = inject(NgbModal);
  bendes: IBende[] = [];
  users: IUser[] = []; // Initialize users array
  specificBende = {} as IBende;
  specificUser = {} as IUser;
  subscription: Subscription | null = null;
  darkroof?: string;
  lightdoor?: string;
  cloudImage?: string;
  blueskyImage?: string;
  grassImage?: string;
  closeResult = '';

  constructor(
    private bendeService: BendeService,
    private userService: UserService,
    private authService: AuthService
  ) {
    this.darkroof = 'assets/dark-roof.png';
    this.lightdoor = 'assets/whitedoor.png';
    this.cloudImage = 'assets/cloudImage.jpg';
    this.blueskyImage = 'assets/bluesky.png';
    this.grassImage = 'assets/grassImage.jpg';
  }

  ngOnInit() {
    this.subscription = this.bendeService.readAll().subscribe((results) => {
      if (results !== null) {
        this.bendes = results.sort((a, b) => {
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
    // Ensure that users array is populated
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

  getBendesInRows(): any[][] {
    const bendesInRows = [];
    for (let i = 0; i < this.bendes.length; i += 3) {
      bendesInRows.push(this.bendes.slice(i, i + 3));
    }
    return bendesInRows;
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

  deleteBende(bendeId: string) {
    this.bendeService.delete(bendeId);
  }

  isAuthenticated(): boolean {
    if (this.authService.isAdmin) return true;
    else return false;
  }
}
