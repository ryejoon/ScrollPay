/* tslint:disable:prefer-for-of */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ImageService} from '../service/image.service';
import {TextSplitOption, TextSplitterService} from '../service/splitter/text-splitter.service';
import {SplitContent} from '../service/splitter/SplitContent';

@Component({
  selector: 'app-upload',
  template: `
      <div fxLayout="column" fxLayoutAlign="start center">
          <div fxLayout="column" fxLayoutAlign="start">
              <mat-form-field>
                  <input matInput [(ngModel)]="title" placeholder="Title" required [maxLength]="500"
                         [ngModelOptions]="{standalone: true}">
              </mat-form-field>
              <mat-form-field>
                  <input matInput [(ngModel)]="description" placeholder="Description" [maxLength]="1000"
                         [ngModelOptions]="{standalone: true}">
              </mat-form-field>
              <form>
                  <input #textFileInput type="file" (change)="setInputFile(textFileInput)"/>
                  <mat-form-field>
                      <input matInput [(ngModel)]="payToAddress" placeholder="Your address to get paid"
                             [ngModelOptions]="{standalone: true}">
                  </mat-form-field>
                  <mat-form-field>
                      <input matInput [(ngModel)]="priceSum" type="number" placeholder="Price to view all the contents"
                             [ngModelOptions]="{standalone: true}">
                  </mat-form-field>
                  <mat-form-field>
                      <input matInput [(ngModel)]="textSplitOption.chunks" type="number" placeholder="Number of chunks"
                             [ngModelOptions]="{standalone: true}">
                      <button mat-stroked-button (click)="apply()">Apply</button>
                  </mat-form-field>
              </form>
          </div>
          <div *ngIf="splitContent" #textContentElem fxLayout="column">
              <div *ngFor="let chunk of splitContent.chunks" fxLayout="row">
                  <textarea [ngStyle]="{backgroundColor: getColor(chunk)}">{{chunk}}</textarea>
                  <div *ngIf="getChunkInfo(chunk) as ch" (click)="setPreview(chunk)" fxLayout="column center">
                      <span *ngIf="chunk === preview" class="preview">Preview</span>
                      <span>{{ch.lines}} lines</span>
                      <span>{{ch.price}} satoshi</span>
                  </div>
              </div>
          </div>
      </div>
  `,
  styles: ['.preview {color: forestgreen}', 'textarea {width: 500px;height: 200px}', 'input {width: 500px}']
})
export class TextUploadComponent implements OnInit {
  @ViewChild('textContentElem', {static: true}) textContentElem: ElementRef;
  title: string;
  description: string;
  payToAddress: string;
  textSplitOption: TextSplitOption = {
    chunks: 100
  };

  priceSum: number;
  preview: string;
  splitContent: SplitContent<string, string>;
  fileContent: any;

  constructor(private imageService: ImageService, private textSplitter: TextSplitterService) { }

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
    if (chunk === this.preview) {
      return {
        lines: linesNum,
        price: 0
      };
    }

    let pp = (this.priceSum) ? (this.priceSum) / (this.textSplitOption.chunks - 1) : '-';
    return {
      lines: linesNum,
      price: pp
    };
  }

  setPreview(chunk: string) {
    this.preview = chunk;
  }

  getColor(chunk: string) {
    return ((this.splitContent.chunks.indexOf(chunk) % 2) === 0) ? 'beige' : 'white';
  }

  apply() {
    this.splitContent = this.textSplitter.split(this.textSplitOption, this.fileContent);
    this.setPreview(this.splitContent.chunks[0]);
  }
}
