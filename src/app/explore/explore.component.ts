import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-explore',
  template: `
    <p>
      explore works!
    </p>
    <router-outlet></router-outlet>
  `,
  styles: ['']
})
export class ExploreComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
