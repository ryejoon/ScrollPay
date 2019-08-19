import { Component, OnInit } from '@angular/core';
import {NeonGenesisService} from '../service/neon-genesis.service';
import {ScrollpayStoreService} from '../service/scrollpay-store.service';

@Component({
  selector: 'app-explore',
  template: `
      <div fxLayout="row" fxLayoutAlign="center">
          <div fxFlex="20">
              <ng-container *ngIf="scrollpayStore.scrollpayItems$ | async as items">
                  <mat-nav-list>
                      <mat-list-item  *ngFor="let item of items" [routerLink]="[item.txid]">{{item.title}}</mat-list-item>
                  </mat-nav-list>
              </ng-container>
          </div>
          <div fxFlex="80">
              <router-outlet></router-outlet>
          </div>
      </div>
  `,
  styles: ['']
})
export class ExploreComponent implements OnInit {

  constructor(private scrollpayStore: ScrollpayStoreService) { }

  ngOnInit() {
  }

}
