import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import { PoliciesComponent } from './policies/policies.component';


@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
    PoliciesComponent
  ],
    imports: [
        CommonModule,
        SharedModule,
        UserRoutingModule,
        ReactiveFormsModule
    ]
})
export class UserModule { }
