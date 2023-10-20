import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import { User } from 'src/app/core/models/User.class';
import { UserService } from 'src/app/modules/profile/service/user.service';
import { RestaurantService } from 'src/app/modules/restaurant/service/restaurant.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent implements OnInit {
  availableRestaurant = [];
  selectedRestaurant: string[] = [];
  categoryForm: FormGroup;

  isEdit = false;
  editCategoryID;
  subscription: any;

  constructor(
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private authService: AuthService,
    private userService: UserService,
    private restaurantService: RestaurantService,
    private categoryService: CategoryService
  ) {}
  ngOnInit() {
    if (this.dialogData && this.dialogData.editing) {
      this.isEdit = true;
      this.editCategoryID = this.dialogData.idCategory;
    }

    this.authService.currentUserInfo$
      .pipe(
        switchMap((user: User) => {
          return this.userService.getUserByUsername(user['cognito:username']);
        }),
        map((userData) => userData?.restaurants || [])
      )
      .pipe(
        switchMap((restaurantIds) => {
          const observables = restaurantIds.map((restaurantId) => {
            return this.restaurantService.getRestaurantById(restaurantId);
          });

          return forkJoin(observables).pipe(
            map((restaurantNames) => {
              return restaurantIds.map((restaurantId, index) => {
                return {
                  id: restaurantId,
                  viewValue: restaurantNames[index].profile.name,
                };
              });
            })
          );
        })
      )
      .subscribe((restaurantsWithNames) => {
        this.availableRestaurant = restaurantsWithNames;
      });

    this.categoryForm = this._fb.group({
      name: ['', Validators.required],
      active: [false, Validators.required],
      restaurantId: [[''], Validators.required],
      items: [[]],
    });

    if (this.isEdit) {
      this.subscription = this.categoryService
        .getCategoryById(this.editCategoryID)
        .subscribe((category) => {
          this.categoryForm.patchValue({
            name: category.name,
            active: category.active,
            restaurantId: category.restaurantId,
          });
        });
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      if (!this.isEdit) {
        this.categoryService.createCategory(this.categoryForm.value).subscribe({
          next: (resp) => {
            console.log(resp);
            this.dialogRef.close({ created: true });
          },
          error: (err) => console.log(err),
        });
      } else {
        console.log('fai altro');
      }
    }
  }

  onCancel() {
    if (this.isEdit) {
      this.unsubscribe();
    }
    this.dialogRef.close();
  }

  unsubscribe() {
    this.subscription.unsubscribe();
  }
}
