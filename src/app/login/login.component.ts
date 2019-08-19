import {Component, OnInit} from '@angular/core';
import {KeyStoreService} from '../service/key-store.service';

declare var moneyButton: any;

@Component({
  selector: 'app-login',
  template: `
      <div *ngIf="!keyStore.key" fxLayout="column" fxLayoutAlign="start center">
              <p>Import your private key: </p>
              <mat-form-field>
                  <input matInput [(ngModel)]="importedKey" (keydown.enter)="importKey()">
              </mat-form-field>
              <button mat-stroked-button (click)="importKey()">Import</button>
              <p class="errorMessage" *ngIf="errorMessage">Invalid Private Key: {{errorMessage}}</p>
              <p>or <button mat-stroked-button (click)="createKey()">Create One</button></p>
      </div>
      <div *ngIf="keyStore.key" fxLayout="column" fxLayoutAlign="center center">
          Your private key is <b>{{keyStore.privateKey}}</b>
          Please keep your key to login again.
      </div>
  `,
  styles: ['.errorMessage { color: red}']
})
export class LoginComponent implements OnInit {

  constructor(public keyStore: KeyStoreService) { }
  importedKey: string;
  errorMessage: string;

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
