import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, of, switchMap } from 'rxjs';
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
  @Input() newItem: boolean;
  @Input() tempImageFile: string;

  @Output() formSubmitted: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSubmitSuccess: EventEmitter<any> = new EventEmitter<any>();

  itemForm: FormGroup;

  subscription;

  constructor(
    private _fb: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.itemForm = this._fb.group({
      name: ['', Validators.required],
      desc: ['', Validators.required],
      price: [0, Validators.required],
      picture: [''],
      inStock: [true, Validators.required],
      rate: [0],
      _id: [''],
    });

    if (this.item) {
      this.itemForm.patchValue({
        name: this.item.name,
        desc: this.item.desc,
        price: this.item.price,
        picture: this.item.picture,
        rate: this.item.rate,
        inStock: this.item.inStock,
        _id: this.item['_id'],
      });
    }

    this.itemForm.valueChanges.pipe(debounceTime(600)).subscribe((value) => {
      this.formSubmitted.emit(value);
    });
  }

  onSubmit() {
    if (this.itemForm.valid && this.itemForm.dirty) {
      if (this.item) {
        this.subscription = this.categoryService.updateItem(
          this.itemForm.value,
          this.idCategory
        );
      } else {
        this.itemForm.removeControl('_id');
        this.subscription = this.categoryService
          .addItemToCategory(this.itemForm.value, this.idCategory)
          .pipe(
            switchMap((item: Items) => {
              console.log(item);

              if (this.tempImageFile) {
                return this.categoryService.uploadImgItem(
                  this.idCategory,
                  item._id,
                  this.tempImageFile
                );
              } else {
                return of(item);
              }
            })
          );
      }

      this.subscription.subscribe({
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

  ngOnDestroy() {
    if (
      this.subscription &&
      typeof this.subscription.unsubscribe === 'function'
    ) {
      this.subscription.unsubscribe();
    }
  }
}
