import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CoreService } from 'src/app/core/services/core/core.service';
import { CategoryService } from '../../service/category.service';
import { Observable, shareReplay, switchMap } from 'rxjs';
import { TemplateRef } from '@angular/core';
import { Items } from 'src/app/core/models/Category.class';
import {
  MAT_DIALOG_DATA,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogBoxComponent } from 'src/app/components/dialog-box/dialog-box.component';

@Component({
  selector: 'app-item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.css'],
})
export class ItemEditComponent implements OnInit {
  item$: Observable<Items>;
  itemId;
  updateCategory = false;
  idCategory;
  subscribe;
  tempImage: string; // Inizialmente nulla
  tempImageFile: string;

  constructor(
    private core: CoreService,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ItemEditComponent>
  ) {}

  ngOnInit() {
    this.idCategory = this.dialogData.idCategory;
    if (this.dialogData.eventType != 'N') {
      this.itemId = this.dialogData?.item;
      this.item$ = this.categoryService
        .getSingleItem(this.itemId)
        .pipe(shareReplay());
    }
  }

  uploadImgItem(file) {
    if (
      file.target.files[0].type == 'image/png' ||
      file.target.files[0].type == 'image/jpeg' ||
      file.target.files[0].type == 'image/jpg'
    ) {
      if (this.dialogData.eventType != 'N') {
        this.categoryService
          .uploadImgItem(this.dialogData.idCategory, this.itemId, file)
          .pipe(
            switchMap(
              () =>
                (this.item$ = this.categoryService.getSingleItem(this.itemId))
            )
          )
          .subscribe(
            (response) => {
              this.core.snackBar(
                'Upload success',
                'OK',
                'v-snack-bar-bg-success'
              );
              this.updateCategory = true;
              this.close();
            },
            (err) => {
              this.core.snackBar(
                err.error.message,
                'OK',
                'v-snack-bar-bg-danger'
              );
            }
          );
      } else {
        const maxWidth = 800;
        const maxHeight = 800;
        this.tempImageFile = file;
        this.resizeImage(file.target.files[0], maxWidth, maxHeight).then(
          (resizedImage) => {
            this.tempImage = URL.createObjectURL(resizedImage);
          }
        );
      }
    } else {
      this.core.snackBar(
        'Not supported image',
        'Try again',
        'v-snack-bar-bg-danger'
      );
    }
  }

  close() {
    this.dialogRef.close({
      updateCategory: this.updateCategory,
      idCategory: this.idCategory,
    });
  }

  handleOnSuccess(event) {
    if (event && event !== 'D') {
      this.updateCategory = true;
      this.close();
    } else if (event == 'D') {
      this.deleteItem();
    }
  }

  deleteItem() {
    const dialogConfig: MatDialogConfig = {
      data: {
        message: 'Eliminare prodotto? ',
        description:
          'Il prodotto verrà rimosso definitivamente dalla categoria.',
        actionButton: 'delete',
      },
    };

    let dialog = this.core.openDialog(DialogBoxComponent, dialogConfig);
    dialog.afterClosed().subscribe((result) => {
      if (result && result.submit) {
        this.subscribe = this.categoryService
          .deleteItemFromCategory(this.itemId, this.idCategory)
          .subscribe({
            next: (val) => {
              this.updateCategory = true;
              this.close();
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    });
  }

  // UTILIS FUNCTION
  async resizeImage(
    file: File,
    maxWidth: number,
    maxHeight: number
  ): Promise<Blob> {
    const img = await createImageBitmap(file);

    let newWidth = maxWidth;
    let newHeight = maxHeight;
    const aspectRatio = img.width / img.height;

    if (img.width / img.height < maxWidth / maxHeight) {
      newHeight = maxWidth / aspectRatio;
    } else {
      newWidth = maxHeight * aspectRatio;
    }

    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    const ctx = canvas.getContext('2d');

    const xOffset = (maxWidth - newWidth) / 2;
    const yOffset = (maxHeight - newHeight) / 2;

    ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, file.type);
    });
  }

  ngOnDestroy() {
    if (this.subscribe) {
      this.subscribe.unsubscribe();
    }
  }
}
//
