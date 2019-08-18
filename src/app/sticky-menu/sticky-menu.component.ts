import { Component, OnInit } from '@angular/core';
import {KeyStoreService} from '../service/key-store.service';
import {BalanceService} from '../service/balance.service';

@Component({
  selector: 'app-sticky-menu',
  template: `
    <div *ngIf="keyStore.key" class="sticky">
      {{balanceStore.getBalance$(keyStore.address) | async}} Satoshi
    </div>
  `,
  styleUrls: ['sticky-menu.component.css']
})
export class StickyMenuComponent implements OnInit {

  constructor(private keyStore: KeyStoreService, private balanceStore: BalanceService) { }

  ngOnInit() {
  }

}
