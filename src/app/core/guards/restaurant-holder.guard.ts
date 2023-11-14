import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, filter } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CoreService } from '../services/core/core.service';
import { RestaurantService } from 'src/app/modules/restaurant/service/restaurant.service';

@Injectable({
  providedIn: 'root',
})
export class RestaurantHolderGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private core: CoreService,
    private restaurantService: RestaurantService
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.currentUser.pipe(
      filter((currentUser) => currentUser !== undefined),
      switchMap((currentUser) => {
        if (!currentUser) {
          this.core.snackBar(
            'Access denied. Please login.',
            'OK',
            'v-snack-bar-bg-danger'
          );
          this.core.goTo('home');
          return of(false);
        }

        let decodedToken;
        if (currentUser.access_token == undefined) {
          decodedToken = jwt_decode(currentUser);
        } else {
          decodedToken = jwt_decode(currentUser.access_token);
        }

        if (decodedToken['payload'].exp < Date.now() / 1000) {
          this.core.snackBar(
            'Expired token. Please login again.',
            'OK',
            'v-snack-bar-bg-danger'
          );
          this.authService.logout();
          return of(false);
        }

        return this.restaurantService
          .getRestaurantById(route.params['id'])
          .pipe(
            switchMap((restaurant) => {
              if (restaurant.profile.username === decodedToken.username) {
                return of(true);
              } else {
                this.core.snackBar(
                  'Access denied. Please login.',
                  'OK',
                  'v-snack-bar-bg-danger'
                );
                this.core.goTo('home');
                return of(false);
              }
            })
          );
      })
    );
  }
}
