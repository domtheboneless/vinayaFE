import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent implements OnInit {
  category: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateCategoryComponent>
  ) {}
  ngOnInit() {
    this.category = this._fb.group({
      name: ['', Validators.required],
      active: [false, Validators.required],
      restaurantId: [[''], Validators.required],
      items: [['']],
    });
  }

  onSubmit() {}

  onCancel() {
    this.dialogRef.close();
  }
}
