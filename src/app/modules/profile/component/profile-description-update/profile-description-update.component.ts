import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';
import { User } from 'src/app/core/models/User.class';
import { CoreService } from 'src/app/core/services/core/core.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-description-update',
  templateUrl: './profile-description-update.component.html',
  styleUrls: ['./profile-description-update.component.css'],
})
export class ProfileDescriptionUpdateComponent implements OnInit {
  userId: string;
  originalUser: User;
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private dialogRef: MatDialogRef<ProfileDescriptionUpdateComponent>,
    private userService: UserService,
    private core: CoreService,
    private _fb: FormBuilder
  ) {}

  ngOnInit() {
    this.form = this._fb.group({
      description: [''],
    });
    this.userId = this.dialogData.userId;
    this.userService.getUserById(this.userId).subscribe((user) => {
      this.originalUser = user;

      this.form.patchValue({
        description: user.profile.description,
      });
    });
  }

  updateUser() {
    this.originalUser.profile.description = this.form.value.description;
    this.userService.updateProfileInfo(this.originalUser).subscribe({
      next: (user) => {
        this.core.snackBar(
          'Aggiornamento completato',
          'OK',
          'v-snack-bar-bg-success'
        );
        this.dialogRef.close({ update: true });
      },
      error: (err) => {
        this.core.snackBar(err.error.message, 'OK', 'v-snack-bar-bg-danger');
        this.dialogRef.close({ update: false });
        this.core.hideLoading();
        console.log(err.error.message);
      },
    });
  }

  closeDialog() {
    this.dialogRef.close({ update: false });
  }
}
