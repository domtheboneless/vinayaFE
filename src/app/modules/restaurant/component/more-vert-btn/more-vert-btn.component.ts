import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CoreService } from 'src/app/core/services/core/core.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RestaurantService } from '../../service/restaurant.service';
import { Observable, of } from 'rxjs';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { QrCodeDialogComponent } from '../qr-code-dialog/qr-code-dialog.component';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-more-vert-btn',
  templateUrl: './more-vert-btn.component.html',
  styleUrls: ['./more-vert-btn.component.css'],
})
export class MoreVertBtnComponent implements OnInit {
  @Input() restaurant;
  @Input() restaurantHolder;
  @Input() routeRestaurantId;
  @Input() tokenExpired;
  @Input() tooltip;
  @Input() morevert;

  @Output() actionEmitter: EventEmitter<any> = new EventEmitter();

  restaurant$: Observable<Restaurant>;

  editMode = false;
  draggableItem = false;
  subscriptions = [];
  categoryLength: number;

  constructor(
    private coreService: CoreService,
    private authService: AuthService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.restaurant$ = of(this.restaurant);
    this.categoryLength = this.restaurant.menu.length;
  }

  goToEdit() {
    this.coreService.goTo(`restaurant/edit/${this.routeRestaurantId}`);
  }

  editModeToggle() {
    if (this.tokenExpired) {
      this.authService.logout();
    } else {
      this.actionEmitter.emit({ type: 'editBtn' });
    }
  }

  draggable() {
    if (this.tokenExpired) {
      this.authService.logout();
    } else {
      this.actionEmitter.emit({ type: 'draggableBtn' });
    }
  }

  uploadImgItem(file, imageType) {
    if (this.tokenExpired) {
      this.authService.logout();
    } else {
      if (
        file.target.files[0].type == 'image/png' ||
        file.target.files[0].type == 'image/jpeg' ||
        file.target.files[0].type == 'image/jpg'
      ) {
        this.subscriptions.push(
          this.restaurantService
            .uploadImage(file, this.routeRestaurantId, imageType)
            .subscribe({
              next: (val) => {
                this.actionEmitter.emit({ type: 'upload' });
              },
            })
        );
      } else {
        this.coreService.snackBar(
          'Not supported image',
          'Try again',
          'v-snack-bar-bg-danger'
        );
      }
    }
  }

  generateQR() {
    const dialogConfig = this.createDialogConfig({
      restaurantID: this.routeRestaurantId,
    });
    this.coreService.openDialog(QrCodeDialogComponent, dialogConfig);
  }

  private createDialogConfig(...data: any[]): MatDialogConfig {
    const dialogConfig: MatDialogConfig = { width: '300px' };
    if (data.length > 0) {
      dialogConfig.data = Object.assign({}, ...data);
    }
    return dialogConfig;
  }
}
