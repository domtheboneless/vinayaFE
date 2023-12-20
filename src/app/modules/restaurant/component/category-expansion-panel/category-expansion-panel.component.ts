import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Category } from 'src/app/core/models/Category.class';
import { findElementByText } from 'src/app/core/utils/dom-utils';

@Component({
  selector: 'app-category-expansion-panel',
  templateUrl: './category-expansion-panel.component.html',
  styleUrls: ['./category-expansion-panel.component.css'],
})
export class CategoryExpansionPanelComponent implements OnInit {
  @Input() category: Category;
  @Input() editMode: boolean;
  @Input() restaurantHolder: boolean;
  @Input() openMatPanelInput;
  @Input() categoryOpen;
  @Input() draggableItem: boolean;

  @Output() openItemEmitter: EventEmitter<any> = new EventEmitter();
  @Output() addNewProductEmitter: EventEmitter<any> = new EventEmitter();
  @Output() editCategoryEmitter: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {}

  constructor(private elementRef: ElementRef) {}

  openItem(item, category) {
    this.openItemEmitter.emit({ item, category });
  }

  addNewProduct() {
    this.addNewProductEmitter.emit({
      newProduct: true,
      category: this.category,
    });
  }

  editCategory() {
    this.editCategoryEmitter.emit(this.category);
  }
}
