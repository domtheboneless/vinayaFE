import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestaurantService } from '../../service/restaurant.service';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { Observable, Subscription, forkJoin, of, switchMap, tap } from 'rxjs';
import { CategoryService } from 'src/app/modules/category/service/category.service';
import { Category } from 'src/app/core/models/Category.class';
import { CoreService } from 'src/app/core/services/core/core.service';
import { ItemDetailComponent } from 'src/app/modules/category/component/item-detail/item-detail.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ItemEditComponent } from 'src/app/modules/category/component/item-edit/item-edit.component';
import { CreateCategoryComponent } from 'src/app/modules/category/component/create-category/create-category.component';
import { CacheService } from 'src/app/core/services/cache/cache.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatAccordion } from '@angular/material/expansion';
import { QrCodeDialogComponent } from '../qr-code-dialog/qr-code-dialog.component';
import Utils from '../../../../core/utils/common-function';
import { CartService } from 'src/app/services/cart/cart.service';
import { CheckOrderDialogComponent } from 'src/app/modules/order/components/check-order-dialog/check-order-dialog.component';

@Component({
  selector: 'app-single-restaurant',
  templateUrl: './single-restaurant.component.html',
  styleUrls: ['./single-restaurant.component.css'],
})
export class SingleRestaurantComponent implements OnInit {
  imgHeigh;
  containerHeight;
  showCreateCategory: boolean = false;

  tooltip = true;
  isElementFixed = false;
  editModeFixed = false;
  draggableItem = false;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  routeRestaurantId;
  tokenPayload;
  restaurant$: Observable<Restaurant>;
  categories$: Observable<Category[]>;
  categoriesArray;
  private originalCategoriesArray: Category[]; // Dichiarare una variabile per mantenere l'array originale
  currentRestaurant;
  categoryOpen;
  restaurantHolder = false;
  editMode = false;
  tokenExpired = false;

  // order var
  dialogCheckOut = false;
  cartBtn = true;
  totalOrderEuro = '0';
  private subscriptions: Subscription[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private categoryService: CategoryService,
    private coreService: CoreService,
    private authService: AuthService,
    private cacheService: CacheService,
    private viewContainerRef: ViewContainerRef,
    private elRef: ElementRef,
    private cartService: CartService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.showCreateCategory = true;
    }, 500);

    this.routeRestaurantId = this.activeRoute.snapshot.params['id'];

    this.restaurant$ = this.authService.currentUserInfo$.pipe(
      tap((currentUser) => {
        if (currentUser) {
          this.tokenPayload = currentUser;
          this.tokenExpired =
            currentUser.exp < Date.now() / 1000 ? true : false;
        }
      }),
      switchMap(() => {
        return this.restaurantService.getRestaurantById(this.routeRestaurantId);
      }),
      tap((restaurant) => {
        this.currentRestaurant = restaurant;
        if (
          this.tokenPayload &&
          restaurant.profile.username == this.tokenPayload['cognito:username']
        ) {
          this.restaurantHolder = true;
        }
        let cache = this.cacheService.get(this.routeRestaurantId);
        if (cache && cache.idRest == this.routeRestaurantId && cache.category) {
          this.tooltip = false;
          this.categories$ = cache.category;
          this.originalCategoriesArray = [...cache.categoryArray];
          this.categoriesArray = [...cache.categoryArray];
        } else {
          this.getCategoriesByRestaurant();
        }
      })
    );

    this.cartService.cartItems$.subscribe((cartItem) => {
      let updatedTotalOrderEuro = 0;

      cartItem.forEach((item) => {
        updatedTotalOrderEuro += item.totalEuro;
      });

      if (updatedTotalOrderEuro > 0) {
        this.totalOrderEuro = updatedTotalOrderEuro.toFixed(2);
      }
    });
  }

  async getBackgroundDivHeight() {
    this.containerHeight = await Utils.getBackgroundDivHeight(
      '.v-restaurant-header',
      138.39,
      this.elRef
    );
  }

  generateQR() {
    const dialogConfig = this.createDialogConfig({
      restaurantID: this.routeRestaurantId,
    });
    this.coreService.openDialog(QrCodeDialogComponent, dialogConfig);
  }

  updateOrderProperty(): void {
    if (
      !Utils.arraysAreEqual(this.originalCategoriesArray, this.categoriesArray)
    ) {
      const jsonObject = { menu: this.categoriesArray };
      this.subscriptions.push(
        this.restaurantService
          .editProfile(jsonObject, this.routeRestaurantId)
          .subscribe()
      );
      this.originalCategoriesArray = [...this.categoriesArray];
      this.updateCacheWithCategories(this.categoriesArray);
    }
    this.draggableItem = false;
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
    if (!this.draggableItem) {
      this.coreService.snackBar(
        'Trascina le categorie per riordinarle',
        'OK',
        'v-snack-bar-bg-success'
      );
    }
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
      this.draggableItem = false;
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

    this.subscriptions.push(
      dialog.afterClosed().subscribe((result) => {
        if (result && result.updateCategory) {
          const categoryId = result.idCategory;
          this.updateCategory(categoryId);
          this.categoryOpen = category.name;
        } else if (result && result.order) {
          // this.coreService.snackBar(
          //   'Aggiunto al carrello',
          //   'OK',
          //   'v-snack-bar-bg-success'
          // ); non mi piace
        }
      })
    );
  }

  createCategory() {
    this.editMode = true;
    const dialogConfig = this.createDialogConfig({
      editing: false,
      restaurantId: this.routeRestaurantId,
    });
    let dialog = this.coreService.openDialog(
      CreateCategoryComponent,
      dialogConfig
    );

    this.subscriptions.push(
      dialog.afterClosed().subscribe((result) => {
        if (result && result.created) {
          this.getCategoriesByRestaurant();
        }
      })
    );
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

    this.subscriptions.push(
      dialog.afterClosed().subscribe((result) => {
        if (result && result.edit) {
          const categoryId = result.idCategory;
          this.updateCategory(categoryId);
        } else if (result && result.deleted) {
          this.getCategoriesByRestaurant();
        }
      })
    );
  }

  hasInactiveCategory;
  checkInactiveCategories(categories: Category[]) {
    this.hasInactiveCategory = categories.some((category) => !category.active);
  }

  hasNovita = false;
  checkNovita(categories: Category[]) {
    this.hasNovita = categories
      .flatMap((category) => category.items || [])
      .some((item) => !!item.picture);
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

    this.subscriptions.push(
      dialog.afterClosed().subscribe((result) => {
        if (result && result.updateCategory) {
          const categoryId = result.idCategory;
          this.updateCategory(categoryId);
        }
      })
    );
  }

  private createDialogConfig(...data: any[]): MatDialogConfig {
    const dialogConfig: MatDialogConfig = { width: '300px' };
    if (data.length > 0) {
      dialogConfig.data = Object.assign({}, ...data);
    }
    return dialogConfig;
  }

  containerHeightEmitter(event) {
    this.containerHeight = event;
  }

  updateCategory(id) {
    this.cacheService.clear();

    this.subscriptions.push(
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
          this.categoriesArray = updatedCategories;
          if (!updatedCategory.restaurantId.includes(this.routeRestaurantId)) {
            this.getCategoriesByRestaurant();
          }
          this.updateCacheWithCategories(updatedCategories);
          this.checkInactiveCategories(updatedCategories);
          this.checkNovita(updatedCategories);
        });
      })
    );
  }

  getCategoriesByRestaurant() {
    this.subscriptions.push(
      this.restaurantService
        .getRestaurantById(this.routeRestaurantId)
        .pipe(
          tap((restaurant) => {
            this.restaurant$ = of(restaurant);
            const categoryObservables = restaurant.menu.map((category) => {
              return this.categoryService.getCategoryById(category);
            });
            if (restaurant.menu.length == 0) {
              this.tooltip = true;
              this.categories$ = of(null);
            } else {
              this.tooltip = false;
              this.subscriptions.push(
                forkJoin(categoryObservables).subscribe((categories) => {
                  this.categoriesArray = categories;
                  this.originalCategoriesArray = [...this.categoriesArray];
                  this.updateCacheWithCategories(categories);
                  this.checkInactiveCategories(categories);
                  this.checkNovita(categories);
                })
              );
            }
          })
        )
        .subscribe()
    );
  }

  goToEdit() {
    this.coreService.goTo(`restaurant/edit/${this.routeRestaurantId}`);
  }

  actionHandler(event) {
    if (event.type == 'upload') {
      this.restaurant$ = this.restaurantService.getRestaurantById(
        this.routeRestaurantId
      );

      this.cacheService.clear();
    } else if (event.type == 'editBtn') {
      this.editModeToggle();
    } else if (event.type == 'draggableBtn') {
      this.draggable();
    }
  }

  uploadImgItem(file, imageType) {
    if (
      file.target.files[0].type == 'image/png' ||
      file.target.files[0].type == 'image/jpeg' ||
      file.target.files[0].type == 'image/jpg'
    ) {
      this.subscriptions.push(
        this.restaurantService
          .uploadImage(file, this.routeRestaurantId, imageType)
          .subscribe({
            next: (val) => {
              this.restaurant$ = this.restaurantService.getRestaurantById(
                this.routeRestaurantId
              );
            },
          })
      );
    } else {
      this.coreService.snackBar(
        'Not supported image',
        'Try again',
        'v-snack-bar-bg-danger'
      );
    }
  }

  private updateCacheWithCategories(categories: Category[]): void {
    this.cacheService.set(this.routeRestaurantId, {
      category: of(categories),
      idRest: this.routeRestaurantId,
      categoryArray: categories,
    });
    this.categories$ = of(categories);
  }

  checkOut() {
    this.dialogCheckOut = true;
    const dialogConfig = this.createDialogConfig({
      restaurantHolder: this.restaurantHolder,
      order: this.cartService.cartItems,
    });

    let dialog = this.coreService.openDialog(
      CheckOrderDialogComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe((res) => {
      this.dialogCheckOut = false;
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
