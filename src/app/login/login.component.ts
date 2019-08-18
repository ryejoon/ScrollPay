import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {KeyStoreService} from '../service/key-store.service';
import {BalanceService} from '../service/balance.service';

declare var moneyButton: any;

@Component({
  selector: 'app-login',
  template: `
      <p>L1CNzXs6yAfyitXsL4Sx5DQJdFuQ1tLNLeP2Y1WsQY9PHDQaqWou</p>
      <div *ngIf="!keyStore.key" fxLayout="column" fxLayoutAlign="start center">
          <p>Import your private key : <input matInput [(ngModel)]="importedKey" (keydown.enter)="importKey()"></p>
          <p class="errorMessage" *ngIf="errorMessage">Invalid Private Key: {{errorMessage}}</p>
          <p>or <button mat-button (click)="createKey()">Create One</button></p>
      </div>
      <div *ngIf="keyStore.key">
          <div fxLayout="column" fxLayoutAlign="start center">
              Hello, {{keyStore.privateKey}}!<br>
              Please keep your key to meet again.
              <div *ngIf="!rendering">Balance : {{balanceService.getBalance$(keyStore.address) | async}} Satoshi</div>
              <mat-progress-bar *ngIf="rendering" mode="indeterminate"></mat-progress-bar>
          </div>
      </div>
      <div #moneyButtonElem></div>

  `,
  styles: ['.errorMessage { color: red}']
})
export class LoginComponent implements OnInit {

  constructor(private keyStore: KeyStoreService, private balanceService: BalanceService) { }

  @ViewChild('moneyButtonElem', {static: true}) moneyButtonElem: ElementRef;
  importedKey: string;
  errorMessage: string;
  rendering: boolean;

  ngOnInit() {
  }

  createKey() {
    this.keyStore.newCalendarKey();
  }

  importKey() {
    try {
      this.keyStore.importKey(this.importedKey);
      this.renderMoneyButton(this.keyStore.address);
    } catch (err) {
      this.errorMessage = err.message;
    }
  }

  private renderMoneyButton(address) {
    console.log(`${address}, ${this.moneyButtonElem}`);
    if (!this.moneyButtonElem) {
      return;
    }
    moneyButton.render(this.moneyButtonElem.nativeElement, {
      to: address,
      amount: '0.01',
      currency: 'USD',
      label: 'Fund Address',
      type: 'tip',
      onPayment: (arg) => {
        this.rendering = true;
        console.log('onPayment', arg);
        setTimeout(() => {
          this.rendering = false;
          this.balanceService.refreshAddressInfo(address);
        }, 5000);
      },
      onError: (arg) => {
        console.log('onError', arg);
      }
    });
  }
}
