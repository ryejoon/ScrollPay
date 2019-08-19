/* tslint:disable:object-literal-shorthand */
import { Injectable } from '@angular/core';
import {KeyStoreService} from './key-store.service';
import {ScrollPayData} from './response';
import {Const} from '../const';
import {BalanceService} from './balance.service';

declare var datapay: any;

@Injectable({
  providedIn: 'root'
})
export class ScrollpayWriterService {

  constructor(private keyStore: KeyStoreService, private balanceStore: BalanceService) { }

  async payForChunk(scrollpayItem: ScrollPayData, cHash: string) {
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

    datapay.send(tx, (err, res) => {
      /**
       * res contains the generated transaction object
       * (a signed transaction, since 'key' is included)
       **/
      console.log(`Scrollpay paid for chunk ${cHash}`);
      console.log(res);
      this.balanceStore.refreshAddressInfo(this.keyStore.address);
    });
  }
}
