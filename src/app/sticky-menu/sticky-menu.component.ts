import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {KeyStoreService} from '../service/key-store.service';
import {BalanceService} from '../service/balance.service';

declare var moneyButton: any;

@Component({
  selector: 'app-sticky-menu',
  template: `
    <div *ngIf="keyStore.key" class="sticky">
        <p *ngIf="!balanceStore.isFetching">Balance {{balanceStore.getBalance$(keyStore.address) | async}} Satoshi</p>
        <mat-progress-spinner *ngIf="balanceStore.isFetching" mode="indeterminate"></mat-progress-spinner>
        <div id="sicky-moneybutton" #moneyButtonElem></div>
    </div>
  `,
  styleUrls: ['sticky-menu.component.css']
})
export class StickyMenuComponent implements OnInit {
  @ViewChild('moneyButtonElem', {static: false}) moneyButtonElem: ElementRef;

  constructor(private keyStore: KeyStoreService, private balanceStore: BalanceService) { }

  ngOnInit() {
    this.keyStore.userKey$.subscribe(uk => {
      if (uk) {
        setTimeout(() => this.renderMoneyButton(uk.address.toString()), 500);
      }
    });
  }

  private renderMoneyButton(address) {
    moneyButton.render(document.getElementById('sicky-moneybutton'), {
      to: address,
      amount: '0.1',
      currency: 'USD',
      label: 'Pay to Read',
      type: 'tip',
      onPayment: (arg) => {
        console.log('onPayment', arg);
        setTimeout(() => {
          this.balanceStore.refreshAddressInfo(address);
          setTimeout(() => {
          }, 2000);
        }, 2000);
      },
      onError: (arg) => {
        console.log('onError', arg);
      }
    });
  }

}
