import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { CoreService } from 'src/app/core/services/core/core.service';
import * as dotenv from 'dotenv';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private serverURL = environment.serverUrl + 'restaurant/';

  constructor(private http: HttpClient, private core: CoreService) {}

  getRestaurantsList(list: string[]): Observable<Restaurant[]> {
    return this.http.post<Restaurant[]>(this.serverURL + 'list', {
      restaurants: list,
    });
  }

  getRestaurantById(id: string): Observable<Restaurant> {
    this.core.showLoading();
    return this.http.get<Restaurant>(this.serverURL + id).pipe(
      finalize(() => {
        this.core.hideLoading();
      })
    );
  }

  addCategoryToMenuRestaurant(
    idRestaurant,
    idCategory
  ): Observable<Restaurant> {
    this.core.showLoading();
    const options = this.headers();

    const body = new FormData();
    body.append('menu', idCategory);

    return this.http
      .put<Restaurant>(
        this.serverURL + 'edit/' + idRestaurant + '/menu/addCategory',
        body,
        options
      )
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  removeCategoryFromMenuRestaurant(
    idRestaurant,
    idCategory
  ): Observable<Restaurant> {
    this.core.showLoading();
    const options = this.headers();

    const body = new FormData();
    body.append('menu', idCategory);

    return this.http
      .put<Restaurant>(
        this.serverURL + 'edit/' + idRestaurant + '/menu/removeCategory',
        body,
        options
      )
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  editProfile(body, idRestaurant): Observable<Restaurant> {
    this.core.showLoading();
    const options = this.headers();

    return this.http
      .put<Restaurant>(
        this.serverURL + 'edit_profile/' + idRestaurant,
        body,
        options
      )
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  createRestaurant(body) {
    this.core.showLoading();
    const options = this.headers();

    return this.http
      .post<Restaurant>(this.serverURL + 'new', body, options)
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  deleteRestaurant(id): Observable<any> {
    this.core.showLoading();
    const options = this.headers();

    return this.http
      .delete<Restaurant>(this.serverURL + 'delete/' + id, options)
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  uploadImage(file, idRestaurant, imageType): Observable<any> {
    this.core.showLoading();
    const options = this.headers();

    let bucket;
    if (imageType && imageType == 'cover') {
      bucket = 'vinaya-coverimg-restaurants';
    } else if (imageType && imageType == 'logo') {
      bucket = 'vinaya-restaurants-logo';
    }

    const body = new FormData();
    body.append('file', file.target.files[0]);
    body.append('bucket', bucket);
    body.append('imageType', imageType);

    return this.http
      .put(
        this.serverURL + 'uploadImageOnBucket/' + idRestaurant,
        body,
        options
      )
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }
  private headers() {
    const bearer = localStorage.getItem('currentUser').replaceAll('"', '');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${bearer}`,
    });
    const options = { headers };
    return options;
  }
}
