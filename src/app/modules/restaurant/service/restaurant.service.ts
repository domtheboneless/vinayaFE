import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restaurant } from 'src/app/core/models/Restaurant.class';
import { CoreService } from 'src/app/core/services/core/core.service';
import * as dotenv from 'dotenv';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  private serverURL = environment.serverUrl;

  constructor(private http: HttpClient, private core: CoreService) {}

  getRestaurantsList(list: string[]): Observable<Restaurant[]> {
    return this.http.post<Restaurant[]>(this.serverURL + 'restaurant/list', {
      restaurants: list,
    });
  }
}
