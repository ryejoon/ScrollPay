import { Injectable } from '@angular/core';
import {NeonGenesisService} from './neon-genesis.service';
import {HttpClient} from '@angular/common/http';
import {NeonScrollPayResponse} from './response';
import {Hosts} from '../const';
import {tap} from 'rxjs/operators';
import {ScrollpayStoreService} from './scrollpay-store.service';

@Injectable({
  providedIn: 'root'
})
export class PaidStoreService {
  private itemStore: FetchedItems = {};
  private fetching = false;

  constructor(private http: HttpClient,
              private scorllpayStore: ScrollpayStoreService) { }

  // itemKey = txid of post tx
  async getOrFetch(itemKey: string, cHash: string) {
    // TODO : pay & payment validation
    console.log(this.itemStore);

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
      console.log(`Item ${itemKey} : cHash ${cHash} value cached: ${r}`);
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
