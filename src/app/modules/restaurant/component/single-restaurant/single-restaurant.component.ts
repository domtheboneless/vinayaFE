import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
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

import {
  CdkDrag,
  CdkDragDrop,
  CdkDragPlaceholder,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-single-restaurant',
  templateUrl: './single-restaurant.component.html',
  styleUrls: ['./single-restaurant.component.css'],
})
export class SingleRestaurantComponent implements OnInit {
  isElementFixed = false;
  editModeFixed = false;
  draggableItem = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  routeRestaurantId;
  restaurant$: Observable<Restaurant>;
  categories$: Observable<Category[]>;
  categoriesArray;
  currentRestaurant;
  categoryOpen;
  restaurantHolder = false;
  subscription;
  editMode = false;
  tokenExpired = false;

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
          this.currentRestaurant = restaurant;
          this.subscription = this.authService.currentUserInfo$.subscribe(
            (currentUser) => {
              this.tokenExpired =
                currentUser.exp < Date.now() / 1000 ? true : false;
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

  updateOrderProperty(): void {
    const jsonObject = { menu: this.categoriesArray };

    setTimeout(() => {
      this.restaurantService
        .editProfile(jsonObject, this.routeRestaurantId)
        .subscribe();
    }, 1000);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.categoriesArray,
      event.previousIndex,
      event.currentIndex
    );
    this.updateOrderProperty();
  }

  draggable() {
    this.draggableItem = !this.draggableItem;
    this.accordion.closeAll();
  }

  editModeToggle() {
    if (this.tokenExpired) {
      this.authService.logout();
    }
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
    const selector = '#' + categoryName.replaceAll(' ', '');
    const element =
      this.viewContainerRef.element.nativeElement.querySelector(selector);

    if (element) {
      const yOffset = element.getBoundingClientRect().top - 150;
      window.scrollTo({ top: window.scrollY + yOffset, behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollPosition = window.pageYOffset;
    this.isElementFixed = scrollPosition > 450;
    this.editModeFixed = scrollPosition > 326;
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
      if (result && result.updateCategory) {
        const categoryId = result.idCategory;
        this.updateCategory(categoryId);
        this.categoryOpen = category.name;
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
    this.addNewProduct(event);
  }

  addNewProduct(event) {
    const dialogConfig = this.createDialogConfig({
      eventType: 'N',
      restaurantHolder: this.restaurantHolder,
      idCategory: event.category._id,
    });

    let dialog = this.coreService.openDialog(ItemEditComponent, dialogConfig);

    dialog.afterClosed().subscribe((result) => {
      if (result && result.updateCategory) {
        const categoryId = result.idCategory;
        this.updateCategory(categoryId);
      }
    });
  }

  private createDialogConfig(...data: any[]): MatDialogConfig {
    const dialogConfig: MatDialogConfig = { width: '300px' };
    if (data.length > 0) {
      dialogConfig.data = Object.assign({}, ...data);
    }
    return dialogConfig;
  }

  updateCategory(id) {
    this.cacheService.clear();
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
        if (!updatedCategory.restaurantId.includes(this.routeRestaurantId)) {
          this.getCategoryByRestaurant();
        }
        this.updateCacheWithCategories(updatedCategories);
      });
    });
  }

  getCategoryByRestaurant() {
    this.subscription = this.restaurantService
      .getRestaurantById(this.routeRestaurantId)
      .pipe(
        tap((restaurant) => {
          this.restaurant$ = of(restaurant);
          const categoryObservables = restaurant.menu.map((category) => {
            return this.categoryService.getCategoryById(category);
          });
          forkJoin(categoryObservables).subscribe((categories) => {
            this.categoriesArray = categories;
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
    console.log('unsub');

    this.subscription.unsubscribe();
  }
}
