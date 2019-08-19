import { Injectable } from '@angular/core';
import bsv from 'bsv';
import {BehaviorSubject} from 'rxjs';

export interface UserKey {
  privateKey: any;
  publicKey: any;
  address: any;
}

@Injectable({
  providedIn: 'root'
})
export class KeyStoreService {
  // tslint:disable-next-line:variable-name
  private userKey: BehaviorSubject<UserKey> = new BehaviorSubject<UserKey>(null);

  constructor() { }

  get key(): UserKey {
    return this.userKey.value;
  }

  get userKey$() {
    return this.userKey.asObservable();
  }

  get privateKey(): string {
    if (!this.userKey.value) {
      return null;
    }
    return this.userKey.value.privateKey.toWIF();
  }

  get address(): string {
    if (!this.userKey.value) {
      return null;
    }
    return this.userKey.value.address.toString();
  }

  public newUserKey() {
    const privk = bsv.PrivateKey.fromRandom();
    this.userKey.next({
      privateKey: privk,
      publicKey: bsv.PublicKey.fromPrivateKey(privk),
      address: bsv.Address.fromPrivateKey(privk)
    });
  }

  public importKey(privateKeyString: string) {
    const privk = bsv.PrivateKey.fromWIF(privateKeyString);
    this.userKey.next({
      privateKey: privk,
      publicKey: bsv.PublicKey.fromPrivateKey(privk),
      address: bsv.Address.fromPrivateKey(privk)
    });
  }
}

export interface UserOption {
  autoPay: boolean;
}
