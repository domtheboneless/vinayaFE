import { Component, Inject, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core/services/core/core.service';
import { RestaurantService } from 'src/app/modules/restaurant/service/restaurant.service';
import { CategoryService } from '../../service/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Items } from 'src/app/core/models/Category.class';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { ItemDetailComponent } from '../item-detail/item-detail.component';
import { AuthGuardService } from 'src/app/core/guards/auth-guard.service';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css'],
})
export class ItemEditComponent implements OnInit {
  currentItem;
  itemPreview;
  item$: Observable<Items>;
  itemId;
  edit = false;
  idCategory;

  constructor(
    private core: CoreService,
    private categoryService: CategoryService,
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ItemEditComponent>
  ) {}

  ngOnInit() {
    this.idCategory = this.dialogData.idCategory;
    this.itemId = this.dialogData.item;
    if (this.dialogData.itemPreview) {
      this.item$ = of(this.dialogData.itemPreview);
    } else {
      this.currentItem = this.activeRoute.snapshot.params['idItem'];
      this.item$ = this.categoryService.getSingleItem(this.itemId);
    }
  }

  uploadImgItem(file) {
    this.categoryService
      .uploadImgItem(this.dialogData.idCategory, this.itemId, file)
      .pipe(
        switchMap(
          () => (this.item$ = this.categoryService.getSingleItem(this.itemId))
        )
      )
      .subscribe(
        (response) => {
          this.core.snackBar('Upload success', 'OK', 'v-snack-bar-bg-success');
          this.edit = true;
          this.close();
        },
        (err) => {
          this.core.snackBar(err.error.message, 'OK', 'v-snack-bar-bg-danger');
        }
      );
  }

  close() {
    this.dialogRef.close({ edit: this.edit, idCategory: this.idCategory });
  }

  preview() {
    this.close();
    const dialogConfig: MatDialogConfig = {
      data: {
        item: this.itemId,
        preview: true,
        itemPreview: this.itemPreview,
        idCategory: this.dialogData.idCategory,
      },
      width: '300px',
      panelClass: '',
    };
    let dialog = this.core.openDialog(ItemDetailComponent, dialogConfig);
  }

  handleFormSubmit(formData: any) {
    this.itemPreview = formData;
  }

  handleOnSuccess(bool) {
    if (bool) {
      this.edit = true;
      this.close();
    }
  }
}
//
