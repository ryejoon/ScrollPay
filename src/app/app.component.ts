import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <mat-toolbar fxLayout="row" fxLayoutAlign="space-between center">
          <div class="toolbar-menu" [routerLink]="['explore']">Explore</div>
          <img src="./assets/scrollpay.png" [routerLink]="['']">
          <div class="toolbar-menu" [routerLink]="['upload']">Upload</div>
      </mat-toolbar>
      <router-outlet></router-outlet>
        <app-sticky-menu></app-sticky-menu>
  `,
  styles: ['img {height: 100%}', '*:focus { outline: none !important; }']
})
export class AppComponent {
}
