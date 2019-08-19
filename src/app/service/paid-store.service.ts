import { Injectable } from '@angular/core';
import {NeonGenesisService} from './neon-genesis.service';
import {HttpClient} from '@angular/common/http';
import {NeonScrollPayResponse, ScrollPayData} from './response';
import {Hosts} from '../const';
import {tap} from 'rxjs/operators';
import {ScrollpayStoreService} from './scrollpay-store.service';
import {ScrollpayWriterService} from './scrollpay-writer.service';

@Injectable({
  providedIn: 'root'
})
export class PaidStoreService {
  private itemStore: FetchedItems = {};
  private fetching = false;

  constructor(private http: HttpClient,
              private scrollpayWriter: ScrollpayWriterService) { }

  // itemKey = txid of post tx
  async getOrFetch(scrollpayItem: ScrollPayData, cHash: string) {
    const itemKey = scrollpayItem.txid;
    const payResult = await this.scrollpayWriter.payForChunk(scrollpayItem, cHash).toPromise();
    if (!payResult) {
      return;
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


interface FetchedItems {
  [itemKey: string]: {
    [cHash: string]: string;
  };
}
