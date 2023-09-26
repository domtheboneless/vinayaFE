import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { CoreService } from 'src/app/core/services/core/core.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private core: CoreService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {}

  async sendForm(form: FormGroup) {
    if (form.status !== 'INVALID') {
      this.authService
        .login(form)
        .pipe(
          catchError((err) => {
            console.log(err);
            this.core.snackBar(err.message, 'OK', 'v-snack-bar-bg-danger');
            return of(null);
          })
        )
        .subscribe((x) => {
          if (x) {
            this.core.goTo('home');
          }
        });
    }
  }
}
