import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core/core.service';
import { ProfileDescriptionUpdateComponent } from 'src/app/modules/profile/component/profile-description-update/profile-description-update.component';
import { UserService } from 'src/app/modules/profile/service/user.service';
import { CategoryService } from '../../service/category.service';
import { Items } from 'src/app/core/models/Category.class';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ProfileDescriptionUpdateComponent>,
    private userService: UserService,
    private core: CoreService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  itemId = this.dialogData.item;
  restHolder = this.dialogData.restaurantHolder;

  item$: Observable<Items>;
  qta = 1;

  ngOnInit() {
    this.item$ = this.categoryService.getSingleItem(this.itemId);
  }

  close() {
    this.dialogRef.close(false);
  }

  moreQta() {
    this.qta += 1;
  }

  lessQta() {
    if (this.qta > 0) {
      this.qta -= 1;
    }
  }

  edit() {
    this.dialogRef.close();
    this.core.goTo('/category/edit/' + this.itemId);
  }
}
