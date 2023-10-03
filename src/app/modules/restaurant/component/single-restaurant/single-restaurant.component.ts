import { Component, ElementRef, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../service/restaurant.service';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { Observable, switchMap, tap } from 'rxjs';
import { CategoryService } from 'src/app/modules/category/service/category.service';
import { Category } from 'src/app/core/models/Category.class';
import { findElementByText } from 'src/app/core/utils/dom-utils';
import { CoreService } from 'src/app/core/services/core/core.service';
import { ItemDetailComponent } from 'src/app/modules/category/component/item-detail/item-detail.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-single-restaurant',
  templateUrl: './single-restaurant.component.html',
  styleUrls: ['./single-restaurant.component.css'],
})
export class SingleRestaurantComponent implements OnInit {
  id;
  restaurant$: Observable<Restaurant>;
  categories$: Observable<Category>;
  categoryOpen;
  restaurantHolder = false;
  subscription;

  constructor(
    private activeRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private categoryService: CategoryService,
    private elementRef: ElementRef,
    private coreService: CoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.id = this.activeRoute.snapshot.params['id'];
    this.restaurant$ = this.restaurantService.getRestaurantById(this.id).pipe(
      tap((restaurant) => {
        this.subscription = this.authService.currentUserInfo$.subscribe((x) => {
          if (restaurant.profile.username == x['cognito:username']) {
            this.restaurantHolder = true;
          }
        });
        this.categories$ = this.categoryService
          .getCategoryByRestaurantId(this.id)
          .pipe(
            tap((category) =>
              this.categoryService.setCategoryHolder(category[0].username)
            )
          );
      })
    );
  }

  openMatPanel(categoryName: string) {
    this.categoryOpen = categoryName; // Apri la categoria

    // Utilizza la funzione findElementByText per trovare un elemento nel DOM
    const categoryElement = findElementByText(this.elementRef, categoryName);

    if (categoryElement) {
      // Esegui lo scorrimento della pagina fino all'elemento
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openItem(item) {
    const dialogConfig: MatDialogConfig = {
      data: { item: item, restaurantHolder: this.restaurantHolder },
      width: '300px',
      panelClass: '',
    };
    let dialog = this.coreService.openDialog(ItemDetailComponent, dialogConfig);
    dialog.afterClosed().subscribe((close) => {});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
