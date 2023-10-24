import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.css'],
})
export class DialogBoxComponent implements OnInit {
  message;
  description;
  actionButton;
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<DialogBoxComponent>
  ) {}

  ngOnInit(): void {
    this.message = this.dialogData.message;
    this.description = this.dialogData.description;
    this.actionButton = this.dialogData.actionButton;
  }

  onSubmit() {
    this.dialogRef.close({ submit: true });
  }

  onCancel() {
    this.dialogRef.close({ submit: false });
  }
}
