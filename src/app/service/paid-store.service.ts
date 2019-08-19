import { Injectable } from '@angular/core';
import {NeonGenesisService} from './neon-genesis.service';
import {HttpClient} from '@angular/common/http';
import {NeonScrollPayResponse} from './response';
import {Hosts} from '../const';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaidStoreService {
  private itemStore: FetchedItems = {};

  constructor(private http: HttpClient,
              private neonGenesis: NeonGenesisService) { }

  async getOrFetch(cHash: string) {
    console.log(this.itemStore);
    if (this.itemStore[cHash]) {
      return this.itemStore[cHash];
    }
    return this.http.get(Hosts.cBitdbHost + cHash, {
      responseType: 'text'
    }).pipe(tap(r => {
      console.log(`cHash ${cHash} value cached: ${r}`);
      this.itemStore[cHash] = r;
      return r;
    })).toPromise();
  }
}


interface FetchedItems {
  [cHash: string]: string;
}
