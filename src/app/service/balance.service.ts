import { Injectable } from '@angular/core';
import {BitindexService} from './bitindex.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, first, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private addressInfo: {[address: string]: BehaviorSubject<any>} = {};
  private fetching = false;
  constructor(private bitindex: BitindexService) { }

  get isFetching() {
    return this.fetching;
  }

  getBalance$(address: string) {
    return this.getAddressInfo(address)
      .pipe(filter(r => r != null), map(r => r.balanceSat + r.unconfirmedBalanceSat));
  }

  getAddressInfo(address: string): Observable<any> {
    if (!this.addressInfo[address]) {
      this.addressInfo[address] = new BehaviorSubject<any>(null);
      this.bitindex.getObservable(address)
        .pipe(first()).subscribe(r => this.addressInfo[address].next(r));
    }
    return this.addressInfo[address].asObservable();
  }

  refreshAddressInfo(address: string) {
    this.fetching = true;
    if (!this.addressInfo[address]) {
      this.getAddressInfo(address)
        .subscribe(r => this.fetching = false);
    } else {
      this.bitindex.getObservable(address)
        .pipe(first())
        .subscribe(r => {
          this.addressInfo[address].next(r);
          this.fetching = false;
        });
    }
  }
}
