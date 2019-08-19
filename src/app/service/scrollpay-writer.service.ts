/* tslint:disable:object-literal-shorthand */
import { Injectable } from '@angular/core';
import {KeyStoreService} from './key-store.service';
import {ScrollPayData} from './response';
import {Const} from '../const';
import {BalanceService} from './balance.service';
import {Observable} from 'rxjs';

declare var datapay: any;

@Injectable({
  providedIn: 'root'
})
export class ScrollpayWriterService {

  constructor(private keyStore: KeyStoreService, private balanceStore: BalanceService) { }

  payForChunk(scrollpayItem: ScrollPayData, cHash: string): Observable<any> {
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
}
