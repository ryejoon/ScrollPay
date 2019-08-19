import {Injectable} from '@angular/core';
import {NeonGenesisService} from './neon-genesis.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {ScrollPayData} from './response';
import {UserOption} from './key-store.service';

const ITEMS_PER_PAGE = 30;

@Injectable({
  providedIn: 'root'
})
export class ScrollpayStoreService {
  private fetchedScrollpayItems$: BehaviorSubject<ScrollPayData[]> = new BehaviorSubject<ScrollPayData[]>([]);
  private options: UserOption = {
    autoPay: true
  }
  fetching = false;

  constructor(private neonGenesis: NeonGenesisService) {
    // na paging for now
    this.fetching = true;
    this.neonGenesis.getScrollPayItems(0, 100)
      .subscribe(r => {
        const transformed = r.c.concat(r.u).map(tx => tx.pushdata).filter(data => this.isValid(data));
        this.fetchedScrollpayItems$.next(transformed);
        this.fetching = false;
      });
  }

  get autoPay(): boolean {
    return this.options.autoPay;
  }

  get scrollpayItems$(): Observable<ScrollPayData[]> {
    return this.fetchedScrollpayItems$.asObservable();
  }

  isValid(data: ScrollPayData) {
    const emptyProperty = Object.keys(data).find(k => {
      if (!data[k]) {
        return k;
      }
    });
    if (emptyProperty) {
      console.log(`Skip empty property ${emptyProperty} for ${data.title}`);
    }
    return (emptyProperty) ? false : true;
  }
}
