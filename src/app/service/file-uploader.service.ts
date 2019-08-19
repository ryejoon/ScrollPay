/* tslint:disable:object-literal-shorthand */
import { Injectable } from '@angular/core';
import {Const, Hosts} from '../const';
import {KeyStoreService} from './key-store.service';
import * as CryptoJS from 'crypto-js';
import {HttpClient} from '@angular/common/http';
import {ScrollpayItem} from './scrollpay/ScrollpayItem';
import {SplitPayOption} from './split/SplitPayOption';
import {EMPTY, Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';

declare var datapay: any;

@Injectable({
  providedIn: 'root'
})
export class FileUploaderService {

  constructor(private keyStore: KeyStoreService, private http: HttpClient) { }

  public alreadyUploaded(sha256Hash: string) {
    return this.http.get(Hosts.cBitdbHost + sha256Hash, {
      responseType: 'text'
    });
  }

  buildTextFileTx(content: string): Observable<any> {
    const cHash = CryptoJS.SHA256(content).toString();
    return this.alreadyUploaded(cHash)
      .pipe(
        switchMap(cApiResponse => {
          if (cApiResponse) {
            console.log(`Already uploaded : ${cHash}`);
            return EMPTY;
          }
          console.log(`CHash : ${cHash}, Content: ${content}`);

          const data = [
            Const.B_PROTOCOL,
            content,
            'text/plain',
            'utf-8'
          ];

          console.log(`Payload : ${data}`);

          const tx = {
            safe: true,
            data: data,
            pay: {
              key: this.keyStore.privateKey,
              rpc: 'https://api.bitindex.network',
              feeb: 2.14
            }
          }

          return new Observable(subscriber => {
            setTimeout(() => subscriber.error('Payment Timeout'), 5000);
            datapay.send(tx, (err, res) => {
              if (err) {
                subscriber.error(err);
                subscriber.complete();
              } else {
                subscriber.next(res);
                subscriber.complete();
              }
            });
          });
        })
      );
  }
}
