import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { RestaurantService } from '../../service/restaurant.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CoreService } from 'src/app/core/services/core/core.service';
import { CacheService } from 'src/app/core/services/cache/cache.service';

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrls: ['./edit-restaurant.component.css'],
})
export class EditRestaurantComponent implements OnInit {
  restaurant$: Observable<Restaurant>;
  routeRestaurantId;
  currentRestaurant: Restaurant;
  currentUser;
  subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private core: CoreService,
    private authService: AuthService,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    this.subscription = this.authService.currentUserInfo$.subscribe(
      (user) => (this.currentUser = user['cognito:username'])
    );

    if (this.activeRoute.snapshot.params['id']) {
      this.routeRestaurantId = this.activeRoute.snapshot.params['id'];
      this.restaurant$ = this.restaurantService
        .getRestaurantById(this.routeRestaurantId)
        .pipe(
          tap((restaurant) => {
            this.currentRestaurant = restaurant;
          })
        );
    } else {
    }
  }

  buttonEmitterHandler(event) {
    if (event.status == 'cancel') {
      this.core.goTo(`restaurant/${this.routeRestaurantId}`);
    } else if (event.status == 'submit' && event.type == 'edit') {
      const jsonObject = { profile: event.form.value };
      this.restaurantService
        .editProfile(jsonObject, this.activeRoute.snapshot.params['id'])
        .subscribe({
          next: (val) => {
            this.core.snackBar(
              'Edit saved success',
              'OK',
              'v-snack-bar-bg-success'
            );
            this.core.goTo(`restaurant/${this.routeRestaurantId}`);
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else if (event.status == 'submit' && event.type == 'new') {
      const jsonObject = { profile: event.form.value, menu: [] };
      jsonObject.profile.username = this.currentUser;

      this.restaurantService.createRestaurant(jsonObject).subscribe({
        next: (res) => {
          this.core.snackBar(
            'Restaurant created',
            'OK',
            'v-snack-bar-bg-success'
          );
          this.cacheService.clear();
          this.core.goTo('restaurant/' + res._id);
        },
        error: (err) => {
          this.core.snackBar('Error: ' + err, 'OK', 'v-snack-bar-bg-danger');
        },
      });
      console.log(jsonObject);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
