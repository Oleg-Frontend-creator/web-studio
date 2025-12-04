import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  private userSubject = new BehaviorSubject<UserInfoType | null>(this.getUserInfo());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  public login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email, password, rememberMe
    });
  }

  public signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password
    });
  }

  public logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      });
    }
    return throwError(() => new Error('Cannot find refresh token'));
  }

  public refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      });
    }
    return throwError(() => new Error('Cannot use token'));
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  public updateUserFromStorage() {
    this.userSubject.next(this.getUserInfo());
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public setUserInfo(id: string, name: string, email: string): void {
    localStorage.setItem('id', id);
    localStorage.setItem('name', name);
    localStorage.setItem('email', email);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public removeUserInfo(): void {
    localStorage.removeItem('id');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    };
  }

  public getUserInfo(): UserInfoType | null {
    if (localStorage.getItem('id') && typeof localStorage.getItem('id') === 'string' &&
      localStorage.getItem('name') && typeof localStorage.getItem('name') === 'string' &&
      localStorage.getItem('email') && typeof localStorage.getItem('email') === 'string')
      return {
        id: localStorage.getItem('id') ? localStorage.getItem('id') as string : '',
        name: localStorage.getItem('name') ? localStorage.getItem('name') as string : '',
        email: localStorage.getItem('email') ? localStorage.getItem('email') as string : '',
      }; else
      return null;
  }
}
