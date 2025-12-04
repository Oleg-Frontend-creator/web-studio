import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {RouterLinkWithHref} from "@angular/router";
import {ModalComponent} from './components/modal/modal.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxMaskModule} from 'ngx-mask';
import {LoaderComponent} from "./layout/loader/loader.component";

@NgModule({
  declarations: [
    ArticleCardComponent,
    ModalComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RouterLinkWithHref,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild()
  ],
  exports: [
    ArticleCardComponent,
    LoaderComponent
  ]
})
export class SharedModule {
}
