import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'mundialauto';
  hide:boolean = false
  show() {
    this.hide = !this.hide;
    console.log(`Hide? ${this.hide}`)
  }
  constructor() {
  }

  ngOnInit() {}
}
