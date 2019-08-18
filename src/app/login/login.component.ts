import { Component, OnInit } from '@angular/core';
import {KeyStoreService, UserKey} from '../service/key-store.service';

@Component({
  selector: 'app-login',
  template: `
      <div *ngIf="!keyStore.key; else greeting" fxLayout="column" fxLayoutAlign="start center">
          <p>Import your private key : <input [(ngModel)]="importedKey" (focusout)="importKey()"></p>
          <p class="errorMessage" *ngIf="errorMessage">Invalid Private Key: {{errorMessage}}</p>
          <p>or <button mat-button (click)="createKey()">Create One</button></p>
      </div>
      <ng-template #greeting>
          <div fxLayout="column" fxLayoutAlign="start center">
              Hello, {{keyStore.privateKey}}!<br>
              Please keep your key to meet again.
          </div>
      </ng-template>
  `,
  styles: ['.errorMessage { color: red}']
})
export class LoginComponent implements OnInit {

  constructor(private keyStore: KeyStoreService) { }

  importedKey: string;
  errorMessage: string;

  ngOnInit() {
  }

  createKey() {
    this.keyStore.newCalendarKey();
  }

  importKey() {
    try {
      this.keyStore.importKey(this.importedKey);
    } catch (err) {
      this.errorMessage = err.message;
    }
  }
}
