import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html',
  styleUrls: ['./qr-code-dialog.component.css'],
})
export class QrCodeDialogComponent implements OnInit {
  url: string;
  @ViewChild('componentContainer') componentContainer: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.url =
      'http://www.vinaya.com/restaurant/' + this.dialogData.restaurantID;
  }

  captureComponent() {
    const element = this.componentContainer.nativeElement;

    html2canvas(element).then((canvas) => {
      // Crea un canvas con le dimensioni desiderate
      const resizedCanvas = document.createElement('canvas');
      const ctx = resizedCanvas.getContext('2d');
      resizedCanvas.width = 360;
      resizedCanvas.height = 479;

      // Imposta l'interpolazione di immagine abilitata per un ridimensionamento più nitido
      ctx.imageSmoothingEnabled = true;

      // Disegna il canvas originale sul canvas ridimensionato
      ctx.drawImage(canvas, 0, 0, resizedCanvas.width, resizedCanvas.height);

      // Converti il canvas ridimensionato in un'immagine JPG
      const imgData = resizedCanvas.toDataURL('image/jpeg', 1.0);

      // Crea un link per scaricare l'immagine
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'screenshot.jpg';
      link.click();
    });
  }
}
