import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CoreService } from '../services/core/core.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private core: CoreService) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser.pipe(
      filter((currentUser) => currentUser !== undefined),
      map((currentUser) => {
        if (!currentUser) {
          this.core.snackBar(
            'Access denied. Please login.',
            'OK',
            'v-snack-bar-bg-danger'
          );
          this.core.goTo('home');
          return false;
        }
        return true;
      })
    );
  }
}
