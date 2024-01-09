import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  inject,
} from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { IUser } from '@ihomer/api';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ihomer-deelnemer-detail',
  templateUrl: './deelnemer-detail.component.html',
})
export class DeelnemerDetailComponent implements OnDestroy {
  private modalService = inject(NgbModal);
  closeResult = '';
  subscription: Subscription | null = null;
  users: IUser[] = [];
  specificUser = {} as IUser;
  user = {} as IUser;

  constructor(private userService: UserService) {}
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  open(content: TemplateRef<any>, user: IUser) {
    this.specificUser = user;
    console.log(this.specificUser);
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-user-title' })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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
}
