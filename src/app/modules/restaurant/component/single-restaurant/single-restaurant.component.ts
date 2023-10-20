import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../service/restaurant.service';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { Observable, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { CategoryService } from 'src/app/modules/category/service/category.service';
import { Category } from 'src/app/core/models/Category.class';
import { findElementByText } from 'src/app/core/utils/dom-utils';
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

          const categoryObservables = restaurant.menu.map((category) => {
            return this.categoryService.getCategoryById(category);
          });
          forkJoin(categoryObservables).subscribe((categories) => {
            this.categories$ = of(categories);
          });
        })
      );
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

    dialog.afterClosed().subscribe((result) => {
      if (result.edit) {
        const categoryId = result.idCategory;

        this.categoryService
          .getCategoryById(categoryId)
          .subscribe((updatedCategory) => {
            this.categories$.subscribe((categories) => {
              const updatedCategories = categories.map((category) => {
                if (category._id === categoryId) {
                  return updatedCategory;
                } else {
                  return category;
                }
              });
              this.categories$ = of(updatedCategories);
            });
          });
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
  }

  createCategory() {
    const dialogConfig: MatDialogConfig = {
      data: {
        editing: false,
      },
      width: '300px',
    };
    let dialog = this.coreService.openDialog(
      CreateCategoryComponent,
      dialogConfig
    );
  }

  editCategoryHandler(event) {
    this.editCategory(event);
  }

  editCategory(category) {
    const dialogConfig: MatDialogConfig = {
      data: {
        editing: true,
        idCategory: category._id,
      },
      width: '300px',
    };
    let dialog = this.coreService.openDialog(
      CreateCategoryComponent,
      dialogConfig
    );
  }

  addNewProductHandler(event) {
    this.addNewProduc();
  }

  addNewProduc() {
    console.log('open add new product');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
