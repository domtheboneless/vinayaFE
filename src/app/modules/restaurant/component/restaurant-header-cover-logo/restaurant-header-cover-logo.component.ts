import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import Utils from '../../../../core/utils/common-function';
import { CoreService } from 'src/app/core/services/core/core.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RestaurantService } from '../../service/restaurant.service';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { Observable, of } from 'rxjs';
import { MatDialogConfig } from '@angular/material/dialog';
import { QrCodeDialogComponent } from '../qr-code-dialog/qr-code-dialog.component';

@Component({
  selector: 'app-restaurant-header-cover-logo',
  templateUrl: './restaurant-header-cover-logo.component.html',
  styleUrls: ['./restaurant-header-cover-logo.component.css'],
})
export class RestaurantHeaderCoverLogoComponent implements OnInit {
  @Input() restaurant;
  @Input() restaurantHolder;
  @Input() routeRestaurantId;
  @Input() tokenExpired;
  @Input() tooltip;
  @Input() morevert;

  @Output() containerHeightEmitter: EventEmitter<any> = new EventEmitter();
  @Output() actionEmitter: EventEmitter<any> = new EventEmitter();

  containerHeight;
  editMode = false;
  draggableItem = false;
  subscriptions = [];
  restaurant$: Observable<Restaurant>;

  constructor(private elRef: ElementRef) {}

  async ngOnInit() {
    this.restaurant$ = of(this.restaurant);
  }

  @HostListener('window:resize', ['$event'])
  async onResize(event: any) {
    this.containerHeight = await this.getBackgroundDivHeight();
  }

  async getBackgroundDivHeight() {
    this.containerHeight = await Utils.getBackgroundDivHeight(
      '.v-restaurant-header',
      138.39,
      this.elRef
    );
    this.containerHeightEmitter.emit(this.containerHeight);
  }

  actionHandler(event) {
    this.actionEmitter.emit(event);
  }
}
