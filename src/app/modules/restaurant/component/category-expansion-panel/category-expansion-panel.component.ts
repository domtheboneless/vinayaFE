import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category } from 'src/app/core/models/Category.class';

@Component({
  selector: 'app-category-expansion-panel',
  templateUrl: './category-expansion-panel.component.html',
  styleUrls: ['./category-expansion-panel.component.css'],
})
export class CategoryExpansionPanelComponent implements OnInit {
  @Input() category: Category;
  @Input() editMode: boolean;
  @Input() restaurantHolder: boolean;

  @Output() openItemEmitter: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {}

  openItem(item, category) {
    this.openItemEmitter.emit({ item, category });
  }
}
