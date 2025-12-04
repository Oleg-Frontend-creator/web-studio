import {Component, AfterViewInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss']
})
export class PoliciesComponent implements AfterViewInit {

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.activatedRoute.fragment.subscribe(fragment => {
        if (!fragment) {
          return;
        }

        const fragmentElement = document.getElementById(fragment);
        if (fragmentElement) {
          fragmentElement.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
      })
    })
  }
}
