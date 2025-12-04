import { Component } from '@angular/core';
import {ModalComponent} from "../../components/modal/modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {filter} from "rxjs";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  currentFragment: string | null = null;

  constructor(private modalService: NgbModal,
              private router: Router) {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        this.currentFragment = tree.fragment;
      });
  }

  openModal() {
    this.modalService.open(ModalComponent, {
      centered: true,
      size: 'lg'
    });
  }
}
