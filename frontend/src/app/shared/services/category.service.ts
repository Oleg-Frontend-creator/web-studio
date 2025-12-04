import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CategoryType} from "../../../types/category.type";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {
  }

  getCategories(): Observable<CategoryType[] | DefaultResponseType> {
    return this.http.get<CategoryType[] | DefaultResponseType>(environment.api + 'categories');
  }
}
