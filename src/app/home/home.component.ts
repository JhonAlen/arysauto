import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]
})
export class HomeComponent implements OnInit {

  showNavigationArrows = false;
  showNavigationIndicators = false;
  show = false;
  show2 = false;
  show3 = false;
  autohide = true;
  autohide2 = true;
  autohide3 = true;
  images = [944, 1011, 984].map((n) => `https://picsum.photos/id/${n}/1700/600`);

  constructor(config: NgbCarouselConfig,) { 
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }

  ngOnInit(): void {
  }

}
