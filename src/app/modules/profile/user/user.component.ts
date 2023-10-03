import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import jwt_decode from 'jwt-decode';
import { CoreService } from 'src/app/core/services/core/core.service';
import { Observable, of, switchMap, tap } from 'rxjs';
import { RestaurantService } from '../../restaurant/service/restaurant.service';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { User } from 'src/app/core/models/User.class';
import { HomeComponent } from 'src/app/components/home/home/home.component';
import { ProfileDescriptionUpdateComponent } from '../component/profile-description-update/profile-description-update.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { CacheService } from 'src/app/core/services/cache/cache.service';

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
    private restaurantService: RestaurantService,
    private cacheService: CacheService
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

        if (this.decode.username == this.urlID) {
          if (this.cacheService.get('userProfile')) {
            this.userProfile$ = of(this.cacheService.get('userProfile'));
            this.restaurants$ = of(this.cacheService.get('restaurantList'));
            this.userProfile$.subscribe((user) => (this.userId = user._id));
          } else {
            this.userProfile$ = this.userService
              .getUserByUsername(this.decode.username)
              .pipe(
                tap((user: User) => {
                  this.userId = user._id;
                  this.restaurants$ = this.restaurantService
                    .getRestaurantsList(user.restaurants)
                    .pipe(
                      tap((rest: Restaurant[]) => {
                        this.cacheService.set('restaurantList', rest);
                      })
                    );
                  this.cacheService.set('userProfile', user);
                })
              );
          }
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
