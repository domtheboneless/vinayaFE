import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import jwt_decode from 'jwt-decode';
import { CoreService } from 'src/app/core/services/core/core.service';
import { Observable, switchMap, tap } from 'rxjs';
import { RestaurantService } from '../../restaurant/service/restaurant.service';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { User } from 'src/app/core/models/User.class';
import { HomeComponent } from 'src/app/components/home/home/home.component';
import { ProfileDescriptionUpdateComponent } from '../component/profile-description-update/profile-description-update.component';
import { MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  current;
  urlID;
  decode;
  userToken;
  userProfile$: Observable<User>;
  userId;

  tempRest;
  restaurants$: Observable<Restaurant[]>;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private core: CoreService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.urlID = this.route.snapshot.params['username'];
    this.current = this.authService.currentUser.subscribe((user) => {
      if (user) {
        if (user.access_token) {
          this.decode = jwt_decode(user.access_token);
        } else {
          this.decode = jwt_decode(user);
        }

        if (
          this.decode.payload.exp &&
          this.decode.payload.exp < Date.now() / 1000
        ) {
          this.core.snackBar(
            'Session expired: please login.',
            'OK',
            'v-snack-bar-bg-danger'
          );
        }

        if (this.decode.username == this.urlID) {
          this.userProfile$ = this.userService
            .getUserByUsername(this.decode.username)
            .pipe(
              tap((user: User) => {
                this.userId = user._id;
                this.restaurants$ = this.restaurantService.getRestaurantsList(
                  user.restaurants
                );
              })
            );
        } else {
          this.authService.logout();
          this.core.goTo('home');
        }
      }
    });
  }

  onFileSelected(event) {
    this.userService
      .uploadProfilePicture(this.userId, event)
      .pipe(
        switchMap(
          () =>
            (this.userProfile$ = this.userService.getUserByUsername(
              this.decode.username
            ))
        )
      )
      .subscribe(
        (response) => {
          this.core.snackBar('Upload success', 'OK', 'v-snack-bar-bg-success');
        },
        (err) => {
          this.core.snackBar(err.error.message, 'OK', 'v-snack-bar-bg-danger');
        }
      );
  }

  changeDescription() {
    const dialogConfig: MatDialogConfig = {
      data: { userId: this.userId },
      width: '300px',
      height: '200px',
      panelClass: 'form-dialog-color',
    };
    let dialog = this.core.openDialog(
      ProfileDescriptionUpdateComponent,
      dialogConfig
    );

    dialog.afterClosed().subscribe((res) => {
      if (res.update) {
        this.userProfile$ = this.userService.getUserById(this.userId);
      }
    });
  }

  goTo(restaurant: Restaurant) {
    this.core.goTo('/restaurant/' + restaurant._id);
  }

  ngOnDestroy() {
    this.current.unsubscribe();
  }
}
