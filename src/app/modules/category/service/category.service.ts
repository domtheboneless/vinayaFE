import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { Category, Items } from 'src/app/core/models/Category.class';
import { CoreService } from 'src/app/core/services/core/core.service';
import { environment } from 'src/environments/environment.development';
import { RestaurantService } from '../../restaurant/service/restaurant.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private serverURL = environment.serverUrl + 'category/';

  constructor(private http: HttpClient, private core: CoreService) {}

  createCategory(category): Observable<Category> {
    this.core.showLoading();
    const options = this.headers();

    return this.http
      .post<Category>(this.serverURL + 'createCategory', category, options)
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  editCategory(idCategory, categoryForm): Observable<Category> {
    this.core.showLoading();
    const options = this.headers();

    return this.http
      .put<Category>(
        this.serverURL + 'editCategory/' + idCategory,
        categoryForm,
        options
      )
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  deleteCategory(idCategory) {
    this.core.showLoading();
    const options = this.headers();

    return this.http
      .delete<Category>(
        this.serverURL + 'deleteCategory/' + idCategory,
        options
      )
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  getCategoryByRestaurantId(id: string): Observable<Category> {
    return this.http.get<Category>(this.serverURL + 'restaurant/' + id);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(this.serverURL + id);
  }

  getSingleItem(id: string): Observable<Items> {
    this.core.showLoading();
    return this.http
      .get<Items>(this.serverURL + 'getSingleItemFromCategory/' + id)
      .pipe(finalize(() => this.core.hideLoading()));
  }

  uploadImgItem(idCategory, idItem, file) {
    this.core.showLoading();
    const options = this.headers();

    const body = new FormData();
    body.append('file', file.target.files[0]);
    body.append('bucket', 'vinaya-menu-items-image');
    body.append('idItem', idItem);

    return this.http
      .put(this.serverURL + 'uploadImageItem/' + idCategory, body, options)
      .pipe(
        finalize(() => {
          this.core.hideLoading();
        })
      );
  }

  updateItem(itemForm, idCategory): Observable<Items> {
    this.core.showLoading();
    const options = this.headers();

    const body = new FormData();
    body.append('name', itemForm.name);
    body.append('desc', itemForm.desc);
    body.append('picture', itemForm.picture);
    body.append('price', itemForm.price);
    body.append('rate', itemForm.rate);
    body.append('inStock', itemForm.inStock);
    body.append('_id', itemForm._id);

    const jsonObject = {};
    body.forEach((value, key) => {
      jsonObject[key] = value;
    });

    return this.http
      .put<Items>(
        this.serverURL + 'editItemFromCategory/' + idCategory,
        jsonObject,
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
