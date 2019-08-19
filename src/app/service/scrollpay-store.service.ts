import { Injectable } from '@angular/core';
import {NeonGenesisService} from './neon-genesis.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {ScrollpayItem} from './scrollpay/ScrollpayItem';
import {map} from 'rxjs/operators';
import {ScrollPayData, TxItem} from './response';

const ITEMS_PER_PAGE = 30;

@Injectable({
  providedIn: 'root'
})
export class ScrollpayStoreService {
  private fetchedScrollpayItems$: BehaviorSubject<ScrollPayData[]> = new BehaviorSubject<ScrollPayData[]>([]);

  constructor(private neonGenesis: NeonGenesisService) {
    console.log('on init');
    // na paging for now
    this.neonGenesis.getScrollPayItems(0, 100)
      .subscribe(r => {
        console.log(r);
        const transformed = r.c.concat(r.u).map(tx => tx.pushdata).filter(data => this.isValid(data));
        this.fetchedScrollpayItems$.next(transformed);
      });
  }

  get scrollpayItems$(): Observable<ScrollPayData[]> {
    return this.fetchedScrollpayItems$.asObservable();
  }

  isValid(data: ScrollPayData) {
    const emptyProperty = Object.keys(data).find(k => {
      if (!data[k]) {
        console.log(k + ':' + JSON.stringify(data));
        return k;
      }
    });
    return (emptyProperty) ? false : true;
  }
}
