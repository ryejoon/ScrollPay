/* tslint:disable:object-literal-shorthand */
import { Injectable } from '@angular/core';
import {Const, Hosts} from '../const';
import {KeyStoreService} from './key-store.service';
import * as CryptoJS from 'crypto-js';
import {HttpClient} from '@angular/common/http';

declare var datapay: any;

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private keyStore: KeyStoreService, private http: HttpClient) { }

  public uploadChunks(chunks: string[]) {
    chunks.forEach(c => this.buildTextFileTx(c));
  }

  public async alreadyUploaded(sha256Hash: string) {
    return this.http.get(Hosts.cBitdbHost + sha256Hash, {
      responseType: 'text'
    }).toPromise();
  }

  async buildTextFileTx(content: string) {
    const cHash = CryptoJS.SHA256(content).toString();
    const cApiResponse = await this.alreadyUploaded(cHash);
    if (cApiResponse) {
      console.log(`Already uploaded : ${cHash}`);
      return;
    }
    console.log(`CHash : ${cHash}`);

    const data = [
      Const.B_PROTOCOL,
      content,
      'text/plain',
      'utf-8'
    ];

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
