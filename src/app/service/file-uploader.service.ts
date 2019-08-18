/* tslint:disable:object-literal-shorthand */
import { Injectable } from '@angular/core';
import {Const, Hosts} from '../const';
import {KeyStoreService} from './key-store.service';
import {ajax} from 'rxjs/ajax';
import * as CryptoJS from 'crypto-js';

declare var datapay: any;

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private keyStore: KeyStoreService) { }

  public uploadChunks(chunks: string[]) {
    chunks.forEach(c => this.buildTextFileTx(c));
  }

  public async alreadyUploaded(sha256Hash: string) {
    return ajax.get(Hosts.cBitdbHost + sha256Hash).toPromise();
  }

  async buildTextFileTx(content: string) {
    const cHash = CryptoJS.SHA256(content).toString();
    const cApiResponse = await this.alreadyUploaded(cHash);
    if (cApiResponse.response) {
      return;
    }
    console.log(`CHash : ${cHash}`);

    const data = [
      Const.B_PROTOCOL,
      content,
      'text/plain',
      'utf-8'
    ];

    console.log(data);
    const tx = {
      safe: true,
      data: data,
      pay: {
        key: this.keyStore.privateKey,
        rpc: 'https://api.bitindex.network',
        feeb: 2.04
      }
    }

    datapay.send(tx, (err, res) => {
      /**
       * res contains the generated transaction object
       * (a signed transaction, since 'key' is included)
       **/
      console.log(res);
    });
  }
}
