import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, finalize } from 'rxjs';
import { Category, Items } from 'src/app/core/models/Category.class';
import { CoreService } from 'src/app/core/services/core/core.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private serverURL = environment.serverUrl + 'category/';

  private categoryHolder = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private core: CoreService) {}

  getCategoryByRestaurantId(id: string): Observable<Category> {
    return this.http.get<Category>(this.serverURL + 'restaurant/' + id);
  }

  getSingleItem(id: string): Observable<Items> {
    this.core.showLoading();
    return this.http
      .get<Items>(this.serverURL + 'getSingleItemFromCategory/' + id)
      .pipe(finalize(() => this.core.hideLoading()));
  }

  getCategoryHolder() {
    return this.categoryHolder.asObservable();
  }

  setCategoryHolder(holder: string) {
    this.categoryHolder.next(holder);
  }
}
