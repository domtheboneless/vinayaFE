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
import { CacheService } from 'src/app/core/services/cache/cache.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  showCreateCategory: boolean = false;

  current;
  urlID;
  decode;
  userToken;
  userProfile$: Observable<User>;
  userId;

  tempRest;
  restaurants$: Observable<Restaurant[]>;
  editProfileToggle: boolean = false;
  profileHolder = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private core: CoreService,
    private restaurantService: RestaurantService,
    private cacheService: CacheService
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.showCreateCategory = true;
    }, 100); // Ritardo di 2 secondi

    this.urlID = this.route.snapshot.params['username'];
    this.current = this.authService.currentUser.subscribe((user) => {
      if (user) {
        if (user.access_token) {
          this.decode = jwt_decode(user.access_token);
        } else {
          this.decode = jwt_decode(user);
        }

        if (this.decode.username == this.urlID) {
          this.profileHolder = true;
          if (this.cacheService.get('userProfile')) {
            this.userProfile$ = of(this.cacheService.get('userProfile'));
            this.restaurants$ = of(this.cacheService.get('restaurantList'));
            this.userProfile$.subscribe((user) => (this.userId = user._id));
          } else {
            // this.userProfile$ = this.userService
            //   .getUserByUsername(this.decode.username)
            //   .pipe(
            //     tap((user: User) => {
            //       this.userId = user._id;
            //       this.restaurants$ = this.restaurantService
            //         .getRestaurantsList(user.restaurants)
            //         .pipe(
            //           tap((rest: Restaurant[]) => {
            //             this.cacheService.set('restaurantList', rest);
            //           })
            //         );
            //       this.cacheService.set('userProfile', user);
            //     })
            //   );
            this.getUser();
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
            (this.userProfile$ = this.userService
              .getUserByUsername(this.decode.username)
              .pipe(
                tap((user) => {
                  this.cacheService.set('userProfile', user);
                })
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

  goTo(restaurant: Restaurant) {
    this.core.goTo('/restaurant/' + restaurant._id);
  }

  newRest() {
    this.core.goTo('/restaurant/manager/new');
  }

  ngOnDestroy() {
    this.current.unsubscribe();
  }

  editProfile() {
    this.editProfileToggle = !this.editProfileToggle;
  }

  userFormHandler(event) {
    if (event == 'cancel') this.editProfile();

    if (event == 'update') {
      this.cacheService.clear();
      this.getUser();
      this.editProfile();
    }
  }

  getUser() {
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
}
