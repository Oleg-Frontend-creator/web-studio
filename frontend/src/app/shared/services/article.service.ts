import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ArticleType} from "../../../types/article.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {ActiveCategoriesParamsType} from "../../../types/active-categories-params.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  constructor(private http: HttpClient) {
  }

  getArticles(params?: ActiveCategoriesParamsType): Observable<{ count: number, pages: number, items: ArticleType[] }> {
    return this.http.get<{ count: number, pages: number, items: ArticleType[] }>(environment.api + 'articles', {
      params: params
    });
  }

  getPopularArticles(): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/top');
  }

  getRelatedArticles(articleUrl: string): Observable<ArticleType[] | DefaultResponseType> {
    return this.http.get<ArticleType[] | DefaultResponseType>(environment.api + 'articles/related/' + articleUrl);
  }

  getArticle(articleUrl: string): Observable<ArticleType | DefaultResponseType> {
    return this.http.get<ArticleType | DefaultResponseType>(environment.api + 'articles/' + articleUrl);
  }
}
