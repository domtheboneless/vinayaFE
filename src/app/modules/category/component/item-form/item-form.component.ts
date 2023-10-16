import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Items } from 'src/app/core/models/Category.class';
import { CategoryService } from '../../service/category.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css'],
})
export class ItemFormComponent implements OnInit {
  @Input() item: Items;
  @Input() idCategory: string;
  @Output() formSubmitted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSubmitSuccess: EventEmitter<any> = new EventEmitter<any>();
  itemForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.itemForm = this._fb.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      price: [0, Validators.required],
      picture: ['', Validators.required],
      inStock: [true, Validators.required],
      rate: [0],
      _id: ['', Validators.required],
    });

    this.itemForm.patchValue({
      name: this.item.name,
      desc: this.item.desc,
      price: this.item.price,
      picture: this.item.picture,
      rate: this.item.rate,
      inStock: this.item.inStock,
      _id: this.item['_id'],
    });

    this.itemForm.valueChanges
      .pipe(debounceTime(600))
      .subscribe((value) => this.formSubmitted.emit(value));
  }

  onSubmit() {
    console.log('submit');

    if (this.itemForm.valid) {
      this.categoryService
        .updateItem(this.itemForm.value, this.idCategory)
        .subscribe({
          next: (val) => {
            this.onSubmitSuccess.emit(true);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  removeItem() {
    console.log(this.item);
  }
}
