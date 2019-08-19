import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ScrollpayStoreService} from '../service/scrollpay-store.service';
import {ActivatedRoute} from '@angular/router';
import {ScrollPayData} from '../service/response';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {PaidStoreService} from '../service/paid-store.service';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-viewer',
  template: `
      <div *ngIf="viewItem" fxLayout="column">
          <h3>{{viewItem.title}}</h3>
          <h4>{{viewItem.description}}</h4>
          <h6>{{viewItem.preview}}</h6>
      </div>
      <div class="text-content" #contentElem (scroll)="onScroll()"></div>
      <mat-progress-bar mode="indeterminate" *ngIf="paidStore.isFetching"></mat-progress-bar>
  `,
  styles: ['h3 {text-align: center; width: 100%}', '.text-content {height: 100px;overflow: scroll}']
})
export class ViewerComponent implements OnInit {
  @ViewChild('contentElem', {static: true}) textContentElem: ElementRef;
  viewingChunk: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  viewItem: ScrollPayData;
  currentChunk: string;

  constructor(private scrollpayStore: ScrollpayStoreService,
              private route: ActivatedRoute,
              private paidStore: PaidStoreService) { }

  retryCount = 0;
  ngOnInit() {
    this.route.paramMap.subscribe(pm => {
      this.resetContent();
      const txid = pm.get('txid');
      this.scrollpayStore.scrollpayItems$
        .pipe(map(arr => arr.find(item => item.txid === txid)))
        .subscribe(d => this.viewItem = d);
    });

    this.viewingChunk.subscribe(async c => {
      if (!this.viewItem) {
        return;
      }
      const chunkHashes = this.viewItem.chunkHashes.split(',');
      console.log(`Viewing chunk ${c} of ${chunkHashes.length}`);
      const nextHash = chunkHashes[c];
      await this.paidStore.getOrFetch(this.viewItem, nextHash)
        .then(r => {
          this.currentChunk = r;
          this.retryCount = 0;
          this.renderLines(r);
        }).catch(err => {
        console.log(err);
      });
    });
  }

  private resetContent() {
    const contentElem = this.textContentElem.nativeElement;
    while (contentElem.hasChildNodes()) {
      contentElem.removeChild(contentElem.lastChild);
    }
    this.viewingChunk.next(0);
    this.viewItem = null;
  }

  renderLines(content: string) {
    content.split('\n').forEach(line => {
      const pElem = document.createElement('p');
      pElem.appendChild(document.createTextNode(line));
      this.textContentElem.nativeElement.appendChild(pElem);
    });
  }

  onScroll() {
    if (this.isScrollBottom()) {
      const viewingChunk = this.viewingChunk.value;
      const chunkHashes = this.viewItem.chunkHashes.split(',');
      if (viewingChunk + 1 >= chunkHashes.length) {
        console.log('Bottom reached');
        return;
      }
      if (this.scrollpayStore.autoPay || confirm('next page?')) {
        const renderedChunk = chunkHashes.indexOf(CryptoJS.SHA256(this.currentChunk).toString());
        console.log(`Rendered : ${renderedChunk}, Viewing: ${viewingChunk}`);
        if (renderedChunk !== viewingChunk) {
          console.log(`Retrying chunk ${viewingChunk}`);
          this.viewingChunk.next(viewingChunk);
        } else {
          this.viewingChunk.next(viewingChunk + 1);
        }
      }
    }
  }

  isScrollBottom(): boolean {
    const scrollHeight = this.textContentElem.nativeElement.scrollHeight;
    const offsetHeight = this.textContentElem.nativeElement.offsetHeight;
    const scrollTop = this.textContentElem.nativeElement.scrollTop;
    const diffFromBottom = scrollHeight - (scrollTop + offsetHeight);
    return diffFromBottom === 0;
  }

}
