import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CoreService } from 'src/app/core/services/core/core.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { map, switchMap, tap } from 'rxjs/operators';
@Component({
  selector: 'menu-navigation',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @ViewChild('navbar', { static: false }) navbar!: ElementRef;
  menuItems = [];
  sideLabel = 'Nuovo utente?';
  userLogged;
  constructor(
    private coreService: CoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser
      .pipe(
        tap((current) => {
          if (!current) {
            this.menuItems = this.coreService.menuItemsLoggedOutUser;
            this.userLogged = false;
          } else {
            this.menuItems = this.coreService.menuItemsRestaurant;
            this.userLogged = true;
          }
        }),
        switchMap(() => {
          return this.authService.currentUserInfo$;
        })
      )
      .subscribe((user) => {
        if (user) {
          const username = user['cognito:username'];
          this.sideLabel = 'Ciao ' + username;
          this.menuItems = this.menuItems.map((x) => {
            if (x.title === 'Profilo') {
              const updatedItem = { ...x };
              updatedItem.routerLink = x.routerLink + '/' + username;
              return updatedItem;
            }
            return x;
          });
        }
      });
  }

  logout() {
    this.authService.logout();
    this.sideLabel = 'Nuovo utente?';
  }
}
