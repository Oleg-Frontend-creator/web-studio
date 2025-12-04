import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {CommentType} from "../../../types/comment.type";
import {HttpClient} from "@angular/common/http";
import {CommentActionEnum} from "../../../types/comment-action.enum";
import {CommentActionType} from "../../../types/comment-action.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(private http: HttpClient) {
  }

  getComments(article: string, offset: number): Observable<{ allCount: number, comments: CommentType[] }
    | DefaultResponseType> {
    return this.http.get<{ allCount: number, comments: CommentType[] }
      | DefaultResponseType>(environment.api + 'comments', {
        params: {article: article, offset: offset}
    });
  }

  addComment(commentText: string, articleId: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      text: commentText,
      article: articleId
    });
  }

  addActionForComment(commentId: string,
                      commentAction: CommentActionEnum): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + commentId + '/apply-action', {
      action: commentAction
    });
  }

  getReactionsForComment(commentId: string): Observable<CommentActionType[] | DefaultResponseType> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.api + 'comments/' + commentId + '/actions');
  }

  getReactionsForArticle(articleId: string): Observable<CommentActionType[] | DefaultResponseType> {
    return this.http.get<CommentActionType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {
      params: {articleId}
    });
  }
}
