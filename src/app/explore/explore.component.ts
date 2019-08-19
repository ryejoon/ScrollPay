import { Component, OnInit } from '@angular/core';
import {NeonGenesisService} from '../service/neon-genesis.service';
import {ScrollpayStoreService} from '../service/scrollpay-store.service';

@Component({
  selector: 'app-explore',
  template: `
      <div fxLayout="row">
          <div fxFlex="20">
              <div *ngIf="scrollpayStore.scrollpayItems$ | async as items">
                  <div *ngFor="let item of items" [routerLink]="[item.txid]">
                      {{item.title}}
                  </div>
              </div>
          </div>
          <router-outlet></router-outlet>
      </div>
  `,
  styles: ['']
})
export class ExploreComponent implements OnInit {

  constructor(private scrollpayStore: ScrollpayStoreService) { }

  ngOnInit() {
  }

}
