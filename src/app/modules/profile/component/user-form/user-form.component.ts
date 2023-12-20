import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/User.class';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
})
export class UserFormComponent implements OnInit {
  @Input() userProfile$: Observable<User>;
  @Output() buttonEmitter = new EventEmitter<string>();

  currentUserId: string;
  userForm: FormGroup;

  constructor(private _fb: FormBuilder, private _userService: UserService) {}
  ngOnInit() {
    this.userForm = this._fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      description: [''],
      username: ['', Validators.required],
      email: [''],
      imgProfile: [],
      role: [],
    });
    this.userProfile$.subscribe((user: User) => {
      this.currentUserId = user._id;
      this.userForm.patchValue({
        name: user.profile.name,
        lastname: user.profile.lastname,
        username: user.profile.username,
        description: user.profile.description,
        email: user.profile.email,
        imgProfile: user.profile.imgProfile,
        role: user.profile.role,
      });
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const userObject = {
        profile: {
          name: this.userForm.get('name').value,
          lastname: this.userForm.get('lastname').value,
          username: this.userForm.get('username').value,
          description: this.userForm.get('description').value,
          imgProfile: this.userForm.get('imgProfile').value,
          role: this.userForm.get('role').value,
          email: this.userForm.get('email').value,
        },
      };

      this._userService
        .updateProfileInfo(userObject as User, this.currentUserId)
        .subscribe({
          next: (user) => {
            this.buttonEmitter.emit('update');
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  onCancel() {
    this.buttonEmitter.emit('cancel');
  }
}
