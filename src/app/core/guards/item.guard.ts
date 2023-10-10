import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators'; // Importa gli operatori RxJS necessari

import { CategoryService } from 'src/app/modules/category/service/category.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Items } from '../models/Category.class';
import { CoreService } from '../services/core/core.service';

@Injectable({
  providedIn: 'root',
})
export class ItemGuard implements CanActivate {
  currentUser;

  constructor(
    private router: Router,
    private authService: AuthService,
    private categoryService: CategoryService,
    private core: CoreService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> {
    const itemId = route.params['idItem'];

    return this.authService.currentUserInfo$.pipe(
      switchMap((user) => {
        this.currentUser = user['cognito:username'];
        return this.categoryService.getSingleItem(itemId);
      }),
      map((item: Items) => {
        if (item.username == this.currentUser) {
          return true;
        } else {
          this.core.snackBar(
            'Error: User not authorized',
            'OK',
            'v-snack-bar-bg-danger'
          );
          this.core.goTo('/home');
          return false;
        }
      })
    );
  }
}
