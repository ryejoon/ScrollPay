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
              }
              subscriber.next(res);
              subscriber.complete();
            });
          });
        })
      );
  }

  /**
   * https://babel.bitdb.network/query/1DHDifPvtPgKFPZMRSxmVHhiPvFmxZwbfh/ewogICJ2IjogMywKICAicSI6IHsKICAgICJmaW5kIjogewogICAgICAib3V0LnMxIjogIjFGR2JERnp6M0tlNng4ZE0zVGZhU29HUmZ4MXozQkVVa0IiCiAgICB9LAogICAgImxpbWl0IjogMTAKICB9Cn0=
   * @param scrollpay
   * @param split
   */
  sendScrollpayProtocolTx(scrollpay: ScrollpayItem<string>, split: SplitPayOption) {
    const data = [
      Const.SCROLLPAY_PROTOCOL,
      scrollpay.title,
      scrollpay.description,
      scrollpay.preview,
      scrollpay.chunkSha256Hashes.toString(),
      '|',
      Const.SPLIT_PROTOCOL,
      split.payToAddress,
      split.splitType,
      split.rangeStart.toString(),
      split.rangeEnd.toString(),
      split.priceUnit.toString(),
      split.price.toString()
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
