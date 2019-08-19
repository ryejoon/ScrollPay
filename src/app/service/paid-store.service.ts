import { Injectable } from '@angular/core';
import {NeonGenesisService} from './neon-genesis.service';
import {HttpClient} from '@angular/common/http';
import {NeonScrollPayResponse, ScrollPayData} from './response';
import {Hosts} from '../const';
import {tap} from 'rxjs/operators';
import {ScrollpayStoreService} from './scrollpay-store.service';
import {ScrollpayWriterService} from './scrollpay-writer.service';
import {KeyStoreService} from './key-store.service';

@Injectable({
  providedIn: 'root'
})
export class PaidStoreService {
  private paymentStore: PaidItems = {};
  private itemStore: FetchedItems = {};
  private fetching = false;

  constructor(private http: HttpClient,
              private scrollpayWriter: ScrollpayWriterService,
              private keyStore: KeyStoreService,
              private neonGenesis: NeonGenesisService) {
    this.keyStore.userKey$.subscribe(uk => {
      if (uk) {
        this.refreshPaymentRecord(uk.address.toString());
      }
    });
  }

  private refreshPaymentRecord(address: string) {
    this.paymentStore = {};
    this.neonGenesis.getAllPaidItems(address)
      .subscribe(r => {
        const concat = r.c.concat(r.u);
        concat.forEach(item => {
          const pushData = item.pushdata;
          if (parseInt(pushData.from, 10) >= parseInt(pushData.until, 10)) {
            console.log(`Skipping invalid payment ${item.transaction}`);
            return;
          }
          if (!this.paymentStore[pushData.itemid]) {
            this.paymentStore[pushData.itemid] = new Set();
          }
          this.paymentStore[pushData.itemid].add(parseInt(pushData.from, 10));
        });
        console.log(`Purchased Chunks :`);
      });
  }

  getPaidChunksCount(itemKey: string) {
    if (!this.paymentStore[itemKey]) {
      return 0;
    }
    return this.paymentStore[itemKey].size;
  }

  // itemKey = txid of post tx
  async getOrFetch(scrollpayItem: ScrollPayData, cHash: string) {
    const itemKey = scrollpayItem.txid;
    const chunkIndex = scrollpayItem.chunkHashes.split(',').indexOf(cHash);

    if (this.paymentStore[itemKey].has(chunkIndex)) {
      console.log(`Already purchased chunk ${chunkIndex} from item ${itemKey}`);
    } else {
      const payResult = await this.scrollpayWriter.payForChunk(scrollpayItem, cHash).toPromise();
      if (!payResult) {
        return;
      }
      this.refreshPaymentRecord(this.keyStore.address);
    }


    if (!this.itemStore[itemKey]) {
      this.itemStore[itemKey] = {};
    }
    const itemChunks = this.itemStore[itemKey];
    if (itemChunks[cHash]) {
      return itemChunks[cHash];
    }
    this.fetching = true;
    return this.http.get(Hosts.cBitdbHost + cHash, {
      responseType: 'text'
    }).pipe(tap(r => {
      console.log(`Item ${itemKey} : cHash ${cHash} value cached`);
      itemChunks[cHash] = r;
      return r;
    })).toPromise().finally(() => this.fetching = false);
  }

  get isFetching(): boolean {
    return this.fetching;
  }
}

interface PaidItems {
  [itemKey: string]: Set<number>;
}

interface FetchedItems {
  [itemKey: string]: {
    [cHash: string]: string;
  };
}
