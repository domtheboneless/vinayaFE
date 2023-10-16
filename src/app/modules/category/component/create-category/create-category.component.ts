import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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

  constructor(
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoryComponent>,
    private authService: AuthService,
    private userService: UserService,
    private restaurantService: RestaurantService,
    private categoryService: CategoryService
  ) {}
  ngOnInit() {
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
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: (resp) => console.log(resp),
        error: (err) => console.log(err),
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
