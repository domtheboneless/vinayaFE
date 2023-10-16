import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, finalize, map, tap } from 'rxjs';
import { CoreService } from 'src/app/core/services/core/core.service';
import jwt_decode from 'jwt-decode';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private serverURL = environment.serverUrl;

  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  private currentUserInfo = new BehaviorSubject<any>(null);
  public currentUserInfo$ = this.currentUserInfo.asObservable();

  private current;
  private decode;
  private payLoad;

  constructor(private coreService: CoreService, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();

    if (localStorage.getItem('currentUser') !== null) {
      this.decode = jwt_decode(localStorage.getItem('currentUser'));
      const payload = this.decode.payload;
      this.currentUserInfo.next(payload);
    }
  }

  login(form: FormGroup) {
    // this.coreService.showLoading();
    return this.http.post<any>(`${this.serverURL}auth/login`, form.value).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user.access_token));
        localStorage.setItem('currentUsername', form.value.username);
        this.coreService.snackBar('Logged in', 'OK', 'v-snack-bar-bg-success');
        this.getCurrentUserInfo();
      }),
      finalize(() => {
        // this.coreService.hideLoading();
      })
    );
  }

  getCurrentUserInfo(): Observable<any> {
    if (localStorage.getItem('currentUser')) {
      this.decode = jwt_decode(localStorage.getItem('currentUser'));
      const payload = this.decode['payload'];
      if (payload) {
        this.currentUserInfo.next(payload);
        return this.currentUserInfo$;
      }
    }
    return null;
  }

  logout() {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.currentUserInfo.next(null);
    this.coreService.snackBar('Logged OUT', 'OK', 'v-snack-bar-bg-success');
    this.coreService.goTo('home');
  }
}
