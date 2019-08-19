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
              <mat-progress-spinner *ngIf="rendering" mode="indeterminate"></mat-progress-spinner>
          </div>
      </div>

  `,
  styles: ['.errorMessage { color: red}']
})
export class LoginComponent implements OnInit {

  constructor(private keyStore: KeyStoreService, private balanceService: BalanceService) { }
  importedKey: string;
  errorMessage: string;
  rendering: boolean;

  ngOnInit() {
  }

  createKey() {
    this.keyStore.newUserKey();
  }

  importKey() {
    try {
      this.keyStore.importKey(this.importedKey);
    } catch (err) {
      this.errorMessage = err.message;
    }
  }
}
