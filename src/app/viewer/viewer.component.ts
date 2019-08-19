import { Component, OnInit } from '@angular/core';
import {ScrollpayStoreService} from '../service/scrollpay-store.service';
import {ActivatedRoute} from '@angular/router';
import {ScrollPayData} from '../service/response';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-viewer',
  template: `
    <div *ngIf="currentItem" fxLayout="column">
        <h3>{{currentItem.title}}</h3>
        <h5>{{currentItem.description}}</h5>
    </div>
  `,
  styles: []
})
export class ViewerComponent implements OnInit {
  currentItem: ScrollPayData;

  constructor(private scrollpayStore: ScrollpayStoreService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(pm => {
      const txid = pm.get('txid');
      this.scrollpayStore.scrollpayItems$
        .pipe(map(arr => arr.find(item => item.txid === txid)))
        .subscribe(d => this.currentItem = d);
    });
  }

}
