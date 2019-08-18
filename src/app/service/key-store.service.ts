import { Injectable } from '@angular/core';
import bsv from 'bsv';

export interface UserKey {
  privateKey: any;
  publicKey: any;
  address: string;
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
    return this._key.privateKey.toWIF();
  }

  public newCalendarKey() {
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
