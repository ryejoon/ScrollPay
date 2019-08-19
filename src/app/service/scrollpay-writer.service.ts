/* tslint:disable:object-literal-shorthand */
import { Injectable } from '@angular/core';
import {KeyStoreService} from './key-store.service';
import {ScrollPayData} from './response';
import {Const} from '../const';
import {BalanceService} from './balance.service';
import {EMPTY, Observable} from 'rxjs';
import {ScrollpayItem} from './scrollpay/ScrollpayItem';
import {SplitPayOption} from './split/SplitPayOption';

declare var datapay: any;

@Injectable({
  providedIn: 'root'
})
export class ScrollpayWriterService {

  constructor(private keyStore: KeyStoreService, private balanceStore: BalanceService) { }

  payForChunk(scrollpayItem: ScrollPayData, cHash: string): Observable<any> {
    if (!this.keyStore.key) {
      console.log(`No private key set`);
      return EMPTY;
    }
    const chunkIndex = scrollpayItem.chunkHashes.split(',').indexOf(cHash);
    const data = [
      Const.SPLIT_PROTOCOL,
      scrollpayItem.txid,
      chunkIndex.toString(),
      '1'
      ];

    const tx = {
      safe: true,
      data: data,
      pay: {
        key: this.keyStore.privateKey,
        rpc: 'https://api.bitindex.network',
        to: [{
          address: scrollpayItem.paytoAddress,
          value: parseInt(scrollpayItem.price, 10)
        }],
        feeb: 2.04
      }
    }
    console.log(tx);

    return new Observable(subscriber => {
      setTimeout(() => subscriber.error('Payment Timeout'), 5000);
      datapay.send(tx, (err, res) => {
        if (err) {
          subscriber.error(err);
        }
        this.balanceStore.refreshAddressInfo(this.keyStore.address);
        subscriber.next(res);
        subscriber.complete();
      });
    });
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
    console.log(`Publishing ${scrollpay.title}...`);
    console.log(tx);
    datapay.send(tx, (err, res) => {
      /**
       * res contains the generated transaction object
       * (a signed transaction, since 'key' is included)
       **/
      console.log(err);
      console.log(res);
      this.balanceStore.refreshAddressInfo(this.keyStore.address);
    });
  }
}
