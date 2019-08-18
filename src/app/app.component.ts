import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <mat-toolbar fxLayout="row" fxLayoutAlign="space-between center">
          <div class="toolbar-menu" [routerLink]="['explore']">Explore</div>
          <h2 [routerLink]="['']">Welcome to ScrollPay!</h2>
          <div class="toolbar-menu" [routerLink]="['upload']">Upload</div>
      </mat-toolbar>
      <router-outlet></router-outlet>
        <app-sticky-menu></app-sticky-menu>
  `,
  styles: ['mat-toolbar {background-color: antiquewhite}']
})
export class AppComponent {
  title = 'split-viewer';
}
