import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CommentType} from "../../../../types/comment.type";
import {CommentService} from "../../../shared/services/comment.service";
import {AuthService} from "../../../core/auth/auth.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CommentActionEnum} from "../../../../types/comment-action.enum";
import {CommentActionType} from "../../../../types/comment-action.type";
import {CommentVoteType} from "../../../../types/comment-vote.type";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  readonly CommentActionEnum = CommentActionEnum;
  readonly serverStaticPath: string = environment.serverStaticPath;
  isLogged: boolean = false;
  userInfo: UserInfoType | null = null;

  article: ArticleType | null = null;
  relatedArticles: ArticleType[] | null = null;

  commentsOnPage: CommentType[] = [];
  commentsOffsetCount: number = 0;

  constructor(private articleService: ArticleService,
              private commentService: CommentService,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private activatedRoute: ActivatedRoute) {
    this.isLogged = authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.userInfo = this.authService.getUserInfo();

    this.activatedRoute.params.subscribe(params => {
      const articleUrl = params['url'];
      this.loadArticle(articleUrl);
    });
  }

  //убираем заголовок h1 и p (который повторяется возле картинки), если они есть
  processHtml(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const h1 = doc.querySelector('h1');
    if (h1) {
      let next = h1.nextElementSibling;
      if (next && next.tagName.toLowerCase() === 'p') {
        next.remove();
      }
      h1.remove();
    }

    return doc.body.innerHTML;
  }

  loadComments() {
    if (this.article?.commentsCount) {
      const body = {
        article: this.article.id,
        offset: this.commentsOffsetCount
      };

      this.commentService.getComments(body.article, body.offset)
        .subscribe((data: { allCount: number, comments: CommentType[] } | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          (data as { allCount: number, comments: CommentType[] }).comments.forEach(comment => {
            this.commentsOnPage.push(comment);
            this.commentsOffsetCount++;
          });

          this.loadUserReactions();
        });
    }
  }

  loadArticle(articleUrl?: string): void {
    if (articleUrl) {
      this.articleService.getArticle(articleUrl)
        .subscribe((data: ArticleType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.article = data as ArticleType;
          if (this.article.text) {
            this.article.text = this.processHtml((data as ArticleType).text as string);
          }

          if (this.article.url) {
            this.articleService.getRelatedArticles(this.article.url)
              .subscribe((data: ArticleType[] | DefaultResponseType) => {
                if ((data as DefaultResponseType).error !== undefined) {
                  throw new Error((data as DefaultResponseType).message);
                }

                this.relatedArticles = data as ArticleType[];
              });
          }

          if (this.article.comments && this.article.comments.length > 0) {
            this.commentsOnPage = this.article.comments;
            this.commentsOffsetCount = this.article.comments.length;
          }

          this.loadUserReactions();
        });
    } else if (this.article) {
      this.articleService.getArticle(this.article.url)
        .subscribe((data: ArticleType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          this.article = data as ArticleType;
          if (this.article.comments && this.article.comments.length > 0) {
            this.commentsOnPage = this.article.comments;
            this.commentsOffsetCount = this.article.comments.length;
          }
        });
    }
  }

  addComment(commentElement: HTMLTextAreaElement) {
    if (commentElement.value && this.userInfo && this.article) {
      this.commentService.addComment(commentElement.value, this.article.id)
        .subscribe((data: DefaultResponseType) => {
          if (data.error) {
            throw new Error((data as DefaultResponseType).message);
          } else {
            this.loadArticle();
            commentElement.value = '';
            this.loadUserReactions();
          }
          this._snackBar.open(data.message, 'Закрыть');
        });
    } else if (!commentElement.value) {
      this._snackBar.open('Пожалуйста, перед отправкой комментария напишите его :)', 'Закрыть');
    } else {
      this._snackBar.open('Неизвестная, сообщите администратору', 'Закрыть');
    }
  }

  addAction(comment: CommentType, commentAction: CommentActionEnum) {
    this.commentService.addActionForComment(comment.id, commentAction)
      .subscribe({
        next: () => {
          if(commentAction === CommentActionEnum.violate) {
            this._snackBar.open('Жалоба отправлена');
          }

          this.commentService.getReactionsForComment(comment.id)
            .subscribe((data: CommentActionType[] | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error((data as DefaultResponseType).message);
              }
              const reactions = data as CommentActionType[];

              // для того чтобы счетчики изменялись на один лайк/дизлайк динамически по нажатию пользователя

              if (!comment.currentUserVote)
                comment.currentUserVote = null;
              // user повторно нажал лайк
              if (reactions.length === 0 && comment.currentUserVote === 'like' && commentAction === 'like') {
                this.commentsOnPage = this.commentsOnPage.map(commentOnPage =>
                  (comment.id === commentOnPage.id) ? {
                    ...commentOnPage,
                    likesCount: commentOnPage.likesCount - 1,
                    currentUserVote: null
                  } : commentOnPage);
              }

              // у user был нажат лайк, а он нажал дизлайк
              else if (reactions.length > 0 && comment.currentUserVote === 'like' && commentAction === 'dislike') {
                this.commentsOnPage = this.commentsOnPage.map(commentOnPage =>
                  (comment.id === commentOnPage.id) ? {
                    ...commentOnPage,
                    likesCount: commentOnPage.likesCount - 1,
                    dislikesCount: commentOnPage.dislikesCount + 1,
                    currentUserVote: 'dislike'
                  } : commentOnPage);
                this._snackBar.open('Ваш голос учтен');
              }

              // user повторно нажал дизлайк
              else if (reactions.length === 0 && comment.currentUserVote === 'dislike' && commentAction === 'dislike') {
                this.commentsOnPage = this.commentsOnPage.map(commentOnPage =>
                  (comment.id === commentOnPage.id) ? {
                    ...commentOnPage,
                    dislikesCount: commentOnPage.dislikesCount - 1,
                    currentUserVote: null
                  } : commentOnPage);
              }

              // у user был нажат дизлайк, а он нажал лайк
              else if (reactions.length > 0 && comment.currentUserVote === 'dislike' && commentAction === 'like') {
                this.commentsOnPage = this.commentsOnPage.map(commentOnPage =>
                  (comment.id === commentOnPage.id) ? {
                    ...commentOnPage,
                    likesCount: commentOnPage.likesCount + 1,
                    dislikesCount: commentOnPage.dislikesCount - 1,
                    currentUserVote: 'like'
                  } : commentOnPage);
                this._snackBar.open('Ваш голос учтен');
              }

              // user просто нажал лайк
              else if (reactions.length > 0 && comment.currentUserVote === null && commentAction === 'like') {
                this.commentsOnPage = this.commentsOnPage.map(commentOnPage =>
                  (comment.id === commentOnPage.id) ? {
                    ...commentOnPage,
                    likesCount: commentOnPage.likesCount + 1,
                    currentUserVote: 'like'
                  } : commentOnPage);
                this._snackBar.open('Ваш голос учтен');
              }

              // user просто нажал дизлайк
              else if (reactions.length > 0 && comment.currentUserVote === null && commentAction === 'dislike') {
                this.commentsOnPage = this.commentsOnPage.map(commentOnPage =>
                  (comment.id === commentOnPage.id) ? {
                    ...commentOnPage,
                    dislikesCount: commentOnPage.dislikesCount + 1,
                    currentUserVote: 'dislike'
                  } : commentOnPage);
                this._snackBar.open('Ваш голос учтен');
              }
            });
        }, error: (err) => {
          if(err.error.message === 'No auth token') {
            this._snackBar.open('Чтобы оставлять реакции, нужно зарегистрироваться');
          } else {
            if(commentAction === CommentActionEnum.violate) {
              this._snackBar.open('Жалоба уже отправлена');
            } else {
              const message = err.error?.message || err.message || "Неизвестная ошибка";
              this._snackBar.open(message);
            }
          }
        }
      });
  }

  loadUserReactions() {
    if (this.article && this.article.id)
      this.commentService.getReactionsForArticle(this.article.id)
        .subscribe((data: CommentActionType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          const reactions = data as CommentActionType[];
          this.commentsOnPage = this.commentsOnPage.map(commentOnPage => {
            const foundReaction = reactions.find(reaction => reaction.comment === commentOnPage.id);
            if (foundReaction && ['like', 'dislike', null].includes(foundReaction.action)) {
              return {
                ...commentOnPage,
                currentUserVote: foundReaction.action as CommentVoteType
              }
            } else
              return commentOnPage;
          });
        });
  }
}
