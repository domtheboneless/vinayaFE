import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, finalize } from 'rxjs';
import { User } from 'src/app/core/models/User.class';
import { CoreService } from 'src/app/core/services/core/core.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private URL = environment.serverUrl + 'user/';
  constructor(private http: HttpClient, private core: CoreService) {}

  getUserByUsername(username): Observable<User> {
    this.core.showLoading();
    return this.http.get<User>(this.URL + 'username/' + username).pipe(
      finalize(() => {
        this.core.hideLoading();
      })
    );
  }

  getUserById(id): Observable<User> {
    this.core.showLoading();
    return this.http.get<User>(this.URL + id).pipe(
      finalize(() => {
        this.core.hideLoading();
      })
    );
  }

  updateProfileInfo(user: User): Observable<User> {
    this.core.showLoading();
    const bearer = localStorage.getItem('currentUser').replaceAll('"', '');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${bearer}`,
    });
    const options = { headers };

    return this.http
      .put<User>(this.URL + 'editUser/' + user._id, user, options)
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  uploadProfilePicture(userId, file) {
    this.core.showLoading();
    const bearer = localStorage.getItem('currentUser').replaceAll('"', '');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${bearer}`,
    });

    const body = new FormData();
    body.append('file', file.target.files[0]);
    body.append('bucket', 'vinaya-profiles-picture');

    // Aggiunta dell'intestazione alla richiesta HTTP
    const options = { headers };
    return this.http
      .put(this.URL + '/updateImageProfile/' + userId, body, options)
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }
}
