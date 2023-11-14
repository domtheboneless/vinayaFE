import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qr-code-dialog',
  templateUrl: './qr-code-dialog.component.html',
  styleUrls: ['./qr-code-dialog.component.css'],
})
export class QrCodeDialogComponent implements OnInit {
  url: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.url =
      'http://www.vinaya.com/restaurant/' + this.dialogData.restaurantID;
    console.log(this.url);
  }
}
