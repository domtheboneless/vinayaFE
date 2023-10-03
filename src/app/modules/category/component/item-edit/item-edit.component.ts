import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core/core.service';
import { RestaurantService } from 'src/app/modules/restaurant/service/restaurant.service';
import { CategoryService } from '../../service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css'],
})
export class ItemEditComponent implements OnInit {
  currentItem;
  categoryHolder;
  currentUser;

  constructor(
    private core: CoreService,
    private categoryService: CategoryService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentItem = this.activeRoute.snapshot.params['id'];

    this.authService.currentUserInfo$
      .pipe(
        switchMap((user) => {
          this.currentUser = user['cognito:username'];
          return this.categoryService.getCategoryHolder();
        }),
        switchMap((catHolder) => {
          this.categoryHolder = catHolder;
          if (this.currentUser == this.categoryHolder) {
            return this.categoryService.getSingleItem(this.currentItem);
          } else {
            console.log('User not authorized');
            this.core.goTo('home');
            return of(''); // Restituisci un observable vuoto in caso di autorizzazione negata
          }
        })
      )
      .subscribe((x) => {
        console.log(x);
      });

    // console.log(this.currentItem);
  }
}
