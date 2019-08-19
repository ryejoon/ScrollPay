/* tslint:disable:prefer-for-of */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ImageService} from '../service/image.service';
import {TextSplitOption, TextSplitterService} from '../service/splitter/text-splitter.service';
import {SplitContent} from '../service/splitter/SplitContent';
import {ScrollpayItem} from '../service/scrollpay/ScrollpayItem';
import * as CryptoJS from 'crypto-js';
import {FileUploaderService} from '../service/file-uploader.service';
import {SplitPayOption} from '../service/split/SplitPayOption';
import {KeyStoreService} from '../service/key-store.service';
import {ScrollpayWriterService} from '../service/scrollpay-writer.service';

@Component({
  selector: 'app-upload',
  template: `
      <div fxLayout="column" fxLayoutAlign="start center">
          <p class="warn" *ngIf="(keyStore.userKey$ | async) === null">Please login to upload text data.</p>
          <div fxLayout="column" fxLayoutAlign="start">
              <mat-form-field>
                  <input matInput [(ngModel)]="item.title" placeholder="Title" required [maxLength]="500"
                         [ngModelOptions]="{standalone: true}">
              </mat-form-field>
              <mat-form-field>
                  <input matInput [(ngModel)]="item.description" placeholder="Description" [maxLength]="1000"
                         [ngModelOptions]="{standalone: true}">
              </mat-form-field>
              <form fxLayout="column">
                  <label>Select .txt file to publish : <input #textFileInput type="file" accept=".txt"
                                                              (change)="setInputFile(textFileInput)"/></label>
                  <mat-form-field>
                      <input matInput [(ngModel)]="payToAddress" placeholder="Your address to get paid" size="500"
                             [ngModelOptions]="{standalone: true}">
                  </mat-form-field>
                  <mat-form-field>
                      <input matInput [(ngModel)]="priceSum" type="number" placeholder="Price to view all the contents (satoshi)"
                             [ngModelOptions]="{standalone: true}">
                  </mat-form-field>
                  <mat-form-field>
                      <input matInput [(ngModel)]="textSplitOption.chunks" type="number" placeholder="Number of chunks"
                             [ngModelOptions]="{standalone: true}">
                      <button mat-stroked-button (click)="apply()"
                              [disabled]="(keyStore.userKey$ | async) === null">Apply Chunk</button>
                  </mat-form-field>
              </form>
              <button mat-stroked-button (click)="publishItem()"
                      [disabled]="(keyStore.userKey$ | async) === null">Publish</button>
              <mat-progress-bar mode="indeterminate" *ngIf="publishing"></mat-progress-bar>
          </div>
          <div *ngIf="splitContent" #textContentElem fxLayout="column">
              <div *ngFor="let chunk of splitContent.chunks" fxLayout="row">
                  <textarea [ngStyle]="{backgroundColor: getColor(chunk)}">{{chunk}}</textarea>
                  <div *ngIf="getChunkInfo(chunk) as ch" (click)="setPreview(chunk)" fxLayout="column center">
                      <span *ngIf="chunk === item.preview" class="preview">Preview</span>
                      <span>{{ch.lines}} lines</span>
                      <span>{{ch.price}} satoshi</span>
                  </div>
              </div>
          </div>
      </div>
  `,
  styles: ['.warn {color: forestgreen}', '.preview {color: forestgreen}', 'textarea {width: 500px;height: 200px}', 'input {width: 500px}']
})
export class TextUploadComponent implements OnInit {
  @ViewChild('textContentElem', {static: true}) textContentElem: ElementRef;
  payToAddress: string = this.keyStore.address;
  textSplitOption: TextSplitOption = {
    chunks: 10
  };

  item: ScrollpayItem<string> = {
    title: '',
    description: null,
    preview: null,
    chunkSha256Hashes: []
  };

  priceSum: number;
  splitContent: SplitContent<string, string>;
  fileContent: any;
  publishing: boolean;

  constructor(public keyStore: KeyStoreService,
              public imageService: ImageService,
              public textSplitter: TextSplitterService,
              public fileUploader: FileUploaderService,
              public scrollPayWriter: ScrollpayWriterService) { }

  ngOnInit() {
  }

  setInputFile(textInput: HTMLInputElement) {
    const file: File = textInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      this.fileContent = event.target.result;
      this.splitContent = this.textSplitter.split(this.textSplitOption, this.fileContent);
      this.setPreview(this.splitContent.chunks[0]);
    });
    reader.readAsText(file, 'utf-8');
  }

  getChunkInfo(chunk: string) {
    const linesNum = chunk.split('\n').length;
    if (chunk === this.item.preview) {
      return {
        lines: linesNum,
        price: 0
      };
    }

    return {
      lines: linesNum,
      price: (this.priceSum) ? Math.floor((this.priceSum) / (this.textSplitOption.chunks)) : '-'
    };
  }

  setPreview(chunk: string) {
    this.item.preview = chunk;
  }

  getColor(chunk: string) {
    return ((this.splitContent.chunks.indexOf(chunk) % 2) === 0) ? 'beige' : 'white';
  }

  apply() {
    this.splitContent = this.textSplitter.split(this.textSplitOption, this.fileContent);
    this.setPreview(this.splitContent.chunks[0]);
  }

  async publishItem() {
    this.publishing = true;
    const hashes = this.splitContent.chunks.map(c => CryptoJS.SHA256(c).toString());
    this.item.chunkSha256Hashes = hashes;
    console.log(hashes);

    const uploadChunkPromises = this.splitContent.chunks.map(c => this.fileUploader.buildTextFileTx(c).toPromise());

    const result = await this.runInSequence(uploadChunkPromises)
      .catch((err) => {
        alert(`Failed to upload chunks. Please try again later with same configuration : ` + err.message);
      });
    if (!result) {
      this.publishing = false;
      return;
    }
    console.log('Promise Result');
    console.log(result);
    const scrollPay: ScrollpayItem<string> = {
      title: this.item.title,
      description: this.item.description,
      preview: this.item.preview,
      chunkSha256Hashes: hashes
    };

    const splitConfig: SplitPayOption = {
      payToAddress: this.payToAddress,
      splitType: 'range',
      rangeStart: 0,
      rangeEnd: this.splitContent.chunks.length,
      priceUnit: 1,
      price: Math.floor((this.priceSum) / (this.textSplitOption.chunks))
    };
    this.scrollPayWriter.sendScrollpayProtocolTx(scrollPay, splitConfig);
    this.publishing = false;
  }

  async runInSequence(promises) {
    const results = [];
    for (const prom of promises) {
      results.push(await prom);
    }
    return results;
  }
}
