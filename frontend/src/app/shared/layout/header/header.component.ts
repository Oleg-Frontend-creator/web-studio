import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NavigationEnd, Router} from "@angular/router";
import {UserInfoType} from "../../../../types/user-info.type";
import {filter} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogged: boolean = false;
  userInfo: UserInfoType = {id: '', name: '', email: ''};
  currentFragment: string | null = null;

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.isLogged = authService.getIsLoggedIn();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        this.currentFragment = tree.fragment;
      });
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
    });

    this.authService.user$.subscribe(userInfo => {
      if (userInfo) {
        this.userInfo = {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email
        }
      } else {
        this.userInfo = {
          id: '',
          name: '',
          email: ''
        };
      }
    })
  }

  logout() {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.removeUserInfo();
    this.userInfo = {id: '', name: '', email: ''};
    this._snackBar.open('Вы вышли из системы', 'Закрыть');
    this.router.navigate(['/']);
  }
}
