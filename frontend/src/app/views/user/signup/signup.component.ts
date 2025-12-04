import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInfoType} from "../../../../types/user-info.type";
import {UserService} from "../../../shared/services/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[А-Я][а-я]*(?:\s+[А-Я][а-я]*)*$/)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[A-ZА-Я])[0-9A-ZА-Я]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private router: Router) { }

  signup() {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email
      && this.signupForm.value.password && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const signupResponse: LoginResponseType = data as LoginResponseType;
            if (!signupResponse.accessToken || !signupResponse.refreshToken || !signupResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }
            //set tokens
            this.authService.setTokens(signupResponse.accessToken, signupResponse.refreshToken);

            //add username to header
            this.userService.getUserInfo().subscribe((data: UserInfoType | DefaultResponseType) => {
              if ((data as DefaultResponseType).error !== undefined) {
                throw new Error((data as DefaultResponseType).message);
              }

              const userInfoResponse: UserInfoType = data as UserInfoType;
              this.authService.setUserInfo(userInfoResponse.id, userInfoResponse.name, userInfoResponse.email);
              this.authService.updateUserFromStorage();
            });

            this._snackBar.open('Вы успешно зарегистрировались', 'Закрыть');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации', 'Закрыть',);
            }
          }
        });
    }
  }
}
