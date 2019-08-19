import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ScrollpayStoreService} from '../service/scrollpay-store.service';
import {ActivatedRoute} from '@angular/router';
import {ScrollPayData} from '../service/response';
import {map} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {PaidStoreService} from '../service/paid-store.service';

@Component({
  selector: 'app-viewer',
  template: `
      <div *ngIf="viewItem" fxLayout="column">
          <h3>{{viewItem.title}}</h3>
          <h5>{{viewItem.description}}</h5>
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

  constructor(private scrollpayStore: ScrollpayStoreService,
              private route: ActivatedRoute,
              private paidStore: PaidStoreService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(pm => {
      this.resetContent();
      const txid = pm.get('txid');
      this.scrollpayStore.scrollpayItems$
        .pipe(map(arr => arr.find(item => item.txid === txid)))
        .subscribe(d => {
          this.viewItem = d;
          /*if (d && d.preview) {
            this.renderLines(d.preview);
          }*/
          //this.onScroll();
        });
    });

    this.viewingChunk.subscribe(c => {
      if (!this.viewItem) {
        return;
      }
      console.log(this.viewItem);
      const nextHash = this.viewItem.chunkHashes.split(',')[c];
      this.paidStore.getOrFetch(this.viewItem.txid, nextHash).then(r => this.renderLines(r));
    });
  }

  private resetContent() {
    const contentElem = this.textContentElem.nativeElement;
    while (contentElem.hasChildNodes()) {
      contentElem.removeChild(contentElem.lastChild);
    }
    this.viewingChunk.next(0);
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
      if (this.viewingChunk.value + 1 >= this.viewItem.chunkHashes.split(',').length) {
        console.log('Bottom reached');
        return;
      }
      if (this.scrollpayStore.autoPay || confirm('next page?')) {
        this.viewingChunk.next(this.viewingChunk.value + 1);
      }
    }
  }

  isScrollBottom(): boolean {
    const scrollHeight = this.textContentElem.nativeElement.scrollHeight;
    const offsetHeight = this.textContentElem.nativeElement.offsetHeight;
    const scrollTop = this.textContentElem.nativeElement.scrollTop;
    return (scrollHeight - (scrollTop + offsetHeight)) === 0;
  }

}
