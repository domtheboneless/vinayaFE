import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  catchError,
  forkJoin,
  mergeMap,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { RestaurantService } from '../../service/restaurant.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CoreService } from 'src/app/core/services/core/core.service';
import { CacheService } from 'src/app/core/services/cache/cache.service';
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { CategoryService } from 'src/app/modules/category/service/category.service';
import { Category } from 'src/app/core/models/Category.class';

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
    private categoryService: CategoryService,
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
      if (this.routeRestaurantId) {
        this.core.goTo(`restaurant/${this.routeRestaurantId}`);
      } else {
        this.core.goTo(`profile/${this.currentUser}`);
      }
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
    } else if (event.status == 'delete' && event.type == 'delete') {
      console.log('delete ', this.routeRestaurantId);
      const dialogConfig: MatDialogConfig = {
        data: {
          message: 'Eliminare ristorante?',
          description: `L'eliminazione del ristorante è permanente. Sei sicuro di voler eliminare il ristorante?`,
          actionButton: 'delete',
        },
      };

      let dialog = this.core.openDialog(DialogBoxComponent, dialogConfig);
      dialog
        .afterClosed()
        .pipe(
          switchMap((dialogResult) => {
            if (dialogResult.submit) {
              if (this.currentRestaurant.menu.length === 0) {
                return this.restaurantService.deleteRestaurant(
                  this.routeRestaurantId
                );
              } else {
                const categoryObservables = this.currentRestaurant.menu.map(
                  (category) => this.categoryService.getCategoryById(category)
                );
                return forkJoin(categoryObservables);
              }
            }
            return of([]);
          }),
          mergeMap((allCategories) => {
            if (allCategories.length > 0) {
              const removalObservables = allCategories.map(
                (category: Category) => {
                  if (
                    category.restaurantId.length === 1 &&
                    category.restaurantId[0] === this.routeRestaurantId
                  ) {
                    return this.categoryService.deleteCategory(category._id);
                  } else if (category.restaurantId.length > 0) {
                    return forkJoin(
                      category.restaurantId.map((restId: string) => {
                        if (restId === this.routeRestaurantId) {
                          return forkJoin(
                            this.categoryService
                              .removeRestaurantIdFromCategory(
                                category._id,
                                restId
                              )
                              .pipe(
                                catchError((error) => {
                                  this.core.snackBar(
                                    error,
                                    'Try again',
                                    'v-snackbar-success'
                                  );
                                  return of(null); // Return an empty observable in case of an error
                                })
                              ),
                            this.restaurantService
                              .deleteRestaurant(this.routeRestaurantId)
                              .pipe(
                                catchError((error) => {
                                  this.core.snackBar(
                                    error,
                                    'Try again',
                                    'v-snackbar-success'
                                  );
                                  return of(null); // Return an empty observable in case of an error
                                })
                              )
                          );
                        }
                        return of(null);
                      })
                    );
                  }
                  return of(null);
                }
              );

              return forkJoin(removalObservables);
            } else {
              // No categories, nothing to remove
              return of([]);
            }
          }),
          tap((results) => {
            console.log(results);
            this.cacheService.clear();
            this.core.goTo(`profile/${this.currentUser}`);
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
