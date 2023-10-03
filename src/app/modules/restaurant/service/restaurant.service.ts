import { HttpClient } from '@angular/common/http';
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
}
