import { Injectable } from '@angular/core';
import bsv from 'bsv';

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
  private _key: UserKey;

  constructor() { }

  get key(): UserKey {
    return this._key;
  }

  get privateKey(): string {
    if (!this._key) {
      return null;
    }
    return this._key.privateKey.toWIF();
  }

  get address(): string {
    if (!this._key) {
      return null;
    }
    return this._key.address.toString();
  }

  public newUserKey() {
    const privk = bsv.PrivateKey.fromRandom();
    this._key = {
      privateKey: privk,
      publicKey: bsv.PublicKey.fromPrivateKey(privk),
      address: bsv.Address.fromPrivateKey(privk)
    };
  }

  public importKey(privateKeyString: string) {
    const privk = bsv.PrivateKey.fromWIF(privateKeyString);
    console.log(privk);
    this._key = {
      privateKey: privk,
      publicKey: bsv.PublicKey.fromPrivateKey(privk),
      address: bsv.Address.fromPrivateKey(privk)
    };
  }
}

export interface UserOption {
  autoPay: boolean;
}
