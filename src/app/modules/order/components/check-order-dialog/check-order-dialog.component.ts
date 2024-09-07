import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { CoreService } from 'src/app/core/services/core/core.service';
import { ItemDetailComponent } from 'src/app/modules/category/component/item-detail/item-detail.component';
import { ItemEditComponent } from 'src/app/modules/category/component/item-edit/item-edit.component';
import { CategoryService } from 'src/app/modules/category/service/category.service';

@Component({
  selector: 'app-check-order-dialog',
  templateUrl: './check-order-dialog.component.html',
  styleUrls: ['./check-order-dialog.component.css'],
})
export class CheckOrderDialogComponent {
  constructor(
    private core: CoreService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ItemEditComponent>,
    private categoryService: CategoryService,
    private coreService: CoreService
  ) {}

  orders;
  displayedColumns: string[] = ['edit', 'name', 'quantity', 'totalEuro'];

  ngOnInit() {
    const orders = this.dialogData.order.map((order) =>
      this.categoryService.getSingleItem(order.itemId)
    );

    forkJoin(orders).subscribe((res: any) => {
      const orders = this.dialogData.order.map((f) => {
        const matchedItem = res.find((r) => r._id === f.itemId);
        return matchedItem ? { ...f, ...matchedItem } : f;
      });
      console.log(orders);

      this.orders = orders;
    });
  }

  lessQta() {}
  moreQta() {}

  editOrder(element) {
    //apre il dettaglio dell'elemento es. acqua pizza ecc..
    const dialogConfig = this.createDialogConfig({
      item: element.itemId,
    });
    this.dialogRef.close({ edit: true, idOrder: element._id });
    this.coreService.openDialog(ItemDetailComponent, dialogConfig);
  }

  private createDialogConfig(...data: any[]): MatDialogConfig {
    const dialogConfig: MatDialogConfig = { width: '300px' };
    if (data.length > 0) {
      dialogConfig.data = Object.assign({}, ...data);
    }
    return dialogConfig;
  }
}
