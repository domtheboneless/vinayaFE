import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NavigationExtras, Router, UrlTree } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ComponentType } from '@angular/cdk/portal';
@Injectable({
  providedIn: 'root',
})
export class CoreService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  public menuItemsRestaurant = [
    {
      title: 'Home',
      routerLink: '/home',
    },
    {
      title: 'Profilo',
      routerLink: '/profile',
    },
    {
      title: 'Ordini',
      routerLink: '/orders',
    },
    {
      title: 'Help',
      routerLink: '/help',
    },
  ];

  public menuItemsLoggedOutUser = [
    {
      title: 'Login',
      routerLink: '/login',
    },
    {
      title: 'Sign Up',
      routerLink: '/signup',
    },
    {
      title: 'Help',
      routerLink: '/help',
    },
  ];

  constructor(
    private dialog: MatDialog,
    private route: Router,
    private _snackBar: MatSnackBar
  ) {}

  showLoading() {
    this.loadingSubject.next(true);
  }

  hideLoading() {
    this.loadingSubject.next(false);
  }

  openDialog(component: ComponentType<any>, message?: MatDialogConfig<string>) {
    return this.dialog.open(component, message);
  }

  snackBar(message: string, button: string, color: string) {
    this._snackBar.open(message, button, {
      duration: 2000,
      panelClass: color,
    });
  }

  goTo(route: string | UrlTree) {
    this.route.navigateByUrl(route);
  }
}
