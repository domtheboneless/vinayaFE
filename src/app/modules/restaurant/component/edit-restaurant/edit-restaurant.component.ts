import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { RestaurantService } from '../../service/restaurant.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CoreService } from 'src/app/core/services/core/core.service';

@Component({
  selector: 'app-edit-restaurant',
  templateUrl: './edit-restaurant.component.html',
  styleUrls: ['./edit-restaurant.component.css'],
})
export class EditRestaurantComponent implements OnInit {
  restaurant$: Observable<Restaurant>;
  routeRestaurantId;
  currentRestaurant: Restaurant;

  constructor(
    private activeRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private authService: AuthService,
    private core: CoreService
  ) {}

  ngOnInit() {
    if (this.activeRoute.snapshot.params['id']) {
      this.routeRestaurantId = this.activeRoute.snapshot.params['id'];
      this.restaurant$ = this.restaurantService
        .getRestaurantById(this.routeRestaurantId)
        .pipe(
          tap((restaurant) => {
            this.currentRestaurant = restaurant;
          })
        );
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
    }
  }
}
