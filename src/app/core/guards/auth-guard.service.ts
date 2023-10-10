import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CoreService } from '../services/core/core.service';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private core: CoreService) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser.pipe(
      filter((currentUser) => currentUser !== undefined),
      map((currentUser) => {
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
          // return false;
        }
        if (!currentUser) {
          this.core.snackBar(
            'Access denied. Please login.',
            'OK',
            'v-snack-bar-bg-danger'
          );
          this.core.goTo('home');
          return false;
        } else {
          return true;
        }
      })
    );
  }
}
