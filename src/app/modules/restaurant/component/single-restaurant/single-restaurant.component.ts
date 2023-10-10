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
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ItemEditComponent } from 'src/app/modules/category/component/item-edit/item-edit.component';
import { CreateCategoryComponent } from 'src/app/modules/category/component/create-category/create-category.component';

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
  editMode = false;

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
        this.subscription = this.authService.currentUserInfo$.subscribe(
          (currentUser) => {
            if (
              currentUser &&
              restaurant.profile.username == currentUser['cognito:username']
            ) {
              this.restaurantHolder = true;
            }
          }
        );
        this.categories$ = this.categoryService.getCategoryByRestaurantId(
          this.id
        );
      })
    );
  }

  openMatPanel(categoryName: string) {
    this.categoryOpen = categoryName;
    const categoryElement = findElementByText(this.elementRef, categoryName);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  openItem(item, category) {
    const dialogConfig: MatDialogConfig = {
      data: {
        item: item,
        restaurantHolder: this.restaurantHolder,
        idCategory: category._id,
      },
      width: '300px',
      panelClass: '',
    };
    let dialog;
    if (this.editMode) {
      dialog = this.coreService.openDialog(ItemEditComponent, dialogConfig);
    } else {
      dialog = this.coreService.openDialog(ItemDetailComponent, dialogConfig);
    }

    //
    dialog.afterClosed().subscribe((result) => {
      if (result.edit) {
        this.categories$ = this.categoryService.getCategoryByRestaurantId(
          this.id
        );
      }
    });
  }

  editModeToggle() {
    this.editMode = !this.editMode;
    let onOff;
    if (this.editMode) {
      onOff = ' attiva';
    } else {
      onOff = ' disattiva';
    }
    this.coreService.snackBar(
      'Modalità modifica' + onOff,
      'OK',
      'v-snack-bar-bg-success'
    );
  }

  createCategory() {
    const dialogConfig: MatDialogConfig = {
      data: {
        idRestaurant: this.id,
      },
      width: '300px',
    };
    let dialog = this.coreService.openDialog(
      CreateCategoryComponent,
      dialogConfig
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
