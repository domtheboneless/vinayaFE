import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { CoreService } from 'src/app/core/services/core/core.service';
import { CategoryService } from '../../service/category.service';
import { Items } from 'src/app/core/models/Category.class';
import { Observable, of } from 'rxjs';
import { ItemEditComponent } from '../item-edit/item-edit.component';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css'],
})
export class ItemDetailComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ItemDetailComponent>,
    private core: CoreService,
    private categoryService: CategoryService
  ) {}

  itemId = this.dialogData.item;
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
}
