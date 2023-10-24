import {
  Component,
  HostListener,
  OnInit,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../service/restaurant.service';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { Observable, forkJoin, of, tap } from 'rxjs';
import { CategoryService } from 'src/app/modules/category/service/category.service';
import { Category } from 'src/app/core/models/Category.class';
import { CoreService } from 'src/app/core/services/core/core.service';
import { ItemDetailComponent } from 'src/app/modules/category/component/item-detail/item-detail.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ItemEditComponent } from 'src/app/modules/category/component/item-edit/item-edit.component';
import { CreateCategoryComponent } from 'src/app/modules/category/component/create-category/create-category.component';
import { CacheService } from 'src/app/core/services/cache/cache.service';

@Component({
  selector: 'app-single-restaurant',
  templateUrl: './single-restaurant.component.html',
  styleUrls: ['./single-restaurant.component.css'],
})
export class SingleRestaurantComponent implements OnInit {
  isElementFixed = false;

  routeRestaurantId;
  restaurant$: Observable<Restaurant>;
  categories$: Observable<Category[]>;
  categoryOpen;
  restaurantHolder = false;
  subscription;
  editMode = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private categoryService: CategoryService,
    private coreService: CoreService,
    private authService: AuthService,
    private cacheService: CacheService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit() {
    this.routeRestaurantId = this.activeRoute.snapshot.params['id'];
    this.restaurant$ = this.restaurantService
      .getRestaurantById(this.routeRestaurantId)
      .pipe(
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
          let cache = this.cacheService.get(this.routeRestaurantId);
          if (
            cache &&
            cache.idRest == this.routeRestaurantId &&
            cache.category
          ) {
            this.categories$ = cache.category;
          } else {
            this.getCategoryByRestaurant();
          }
        })
      );
  }

  editModeToggle() {
    this.editMode = !this.editMode;
    let onOff;
    if (this.editMode) {
      onOff = ' attiva';
    } else {
      onOff = ' disattiva';
    }
  }

  scrollToElement(categoryName: string) {
    this.categoryOpen = categoryName;
    const selector = '#' + categoryName;
    const element =
      this.viewContainerRef.element.nativeElement.querySelector(selector);
    if (element) {
      const yOffset = element.getBoundingClientRect().top;
      window.scrollTo({ top: window.scrollY + yOffset, behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollPosition = window.pageYOffset;
    this.isElementFixed = scrollPosition > 500;
  }

  openItemHandler(event) {
    this.openItem(event.item, event.category);
  }
  openItem(item, category) {
    const dialogConfig = this.createDialogConfig({
      item: item,
      restaurantHolder: this.restaurantHolder,
      idCategory: category._id,
    });

    let dialog;
    if (this.editMode) {
      dialog = this.coreService.openDialog(ItemEditComponent, dialogConfig);
    } else {
      dialog = this.coreService.openDialog(ItemDetailComponent, dialogConfig);
    }

    dialog.afterClosed().subscribe((result) => {
      if (result.edit) {
        const categoryId = result.idCategory;
        this.updateCategory(categoryId);
      }
    });
  }

  createCategory() {
    const dialogConfig = this.createDialogConfig({ editing: false });
    let dialog = this.coreService.openDialog(
      CreateCategoryComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe((result) => {
      if (result && result.created) {
        this.getCategoryByRestaurant();
      }
    });
  }

  editCategoryHandler(event) {
    this.editCategory(event);
  }

  editCategory(category) {
    const dialogConfig = this.createDialogConfig({
      editing: true,
      idCategory: category._id,
    });
    let dialog = this.coreService.openDialog(
      CreateCategoryComponent,
      dialogConfig
    );

    dialog.afterClosed().subscribe((result) => {
      if (result && result.edit) {
        const categoryId = result.idCategory;
        this.updateCategory(categoryId);
      } else if (result && result.deleted) {
        this.getCategoryByRestaurant();
      }
    });
  }

  addNewProductHandler(event) {
    this.addNewProduct();
  }

  addNewProduct() {
    console.log('open add new product');
  }

  // SUPPORT FUNCTION

  private createDialogConfig(...data: any[]): MatDialogConfig {
    const dialogConfig: MatDialogConfig = { width: '300px' };
    if (data.length > 0) {
      dialogConfig.data = Object.assign({}, ...data);
    }
    return dialogConfig;
  }

  updateCategory(id) {
    this.categoryService.getCategoryById(id).subscribe((updatedCategory) => {
      this.categories$.subscribe((categories) => {
        const updatedCategories = categories.map((category) => {
          if (category._id === id) {
            return updatedCategory;
          } else {
            return category;
          }
        });
        this.categories$ = of(updatedCategories);
        this.updateCacheWithCategories(categories);
      });
    });
  }

  getCategoryByRestaurant(): void {
    this.subscription = this.restaurantService
      .getRestaurantById(this.routeRestaurantId)
      .pipe(
        tap((restaurant) => {
          const categoryObservables = restaurant.menu.map((category) => {
            return this.categoryService.getCategoryById(category);
          });
          forkJoin(categoryObservables).subscribe((categories) => {
            this.updateCacheWithCategories(categories);
          });
        })
      )
      .subscribe();
  }

  private updateCacheWithCategories(categories: Category[]): void {
    this.cacheService.set(this.routeRestaurantId, {
      category: of(categories),
      idRest: this.routeRestaurantId,
    });
    this.categories$ = of(categories);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
