/* tslint:disable:prefer-for-of */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileSnippet, ImageService, ResizedImage} from '../service/image.service';
import {TextSplitOption, TextSplitterService} from '../service/splitter/text-splitter.service';
import {SplitContent} from '../service/splitter/SplitContent';

@Component({
  selector: 'app-upload',
  template: `
      <div>
          <input #textInput type="file" (change)="processText(textInput)"/>
          <!--<input #imageInput type="file" (change)="processImage(imageInput)" accept="image/*" multiple="true"/>-->
          <!--<div *ngFor="let img of resizedImages">
              <img src="{{img.resizedImg.src}}">
          </div>-->
      </div>
      <div>
          <input [(ngModel)]="payToAddress" placeholder="Your address to get paid">
          <input [(ngModel)]="textSplitOption.chunks" placeholder="Number of chunks">
      </div>
      <div *ngIf="splitContent" #textContentElem fxLayout="column">
          <div *ngFor="let chunk of splitContent.chunks" fxLayout="row">
            <textarea [ngStyle]="{backgroundColor: getColor(chunk)}" fxFlex="90">{{chunk}}</textarea>
              <button mat-button (click)="setPreview(chunk)">Set As Preview</button>
          </div>
      </div>
  `,
  styles: ['input {width: 100%}']
})
export class TextUploadComponent implements OnInit {
  @ViewChild('textContentElem', {static: true}) textContentElem: ElementRef;
  payToAddress: string;
  textSplitOption: TextSplitOption = {
    chunks: 10
  };

  preview: string;
  splitContent: SplitContent<string, string>;

  constructor(private imageService: ImageService, private textSplitter: TextSplitterService) { }

  ngOnInit() {
  }


  processText(textInput: HTMLInputElement) {
    const file: File = textInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      const content = event.target.result;
      this.splitContent = this.textSplitter.split(this.textSplitOption, content);
    });
    reader.readAsText(file, 'utf-8');
  }

  setPreview(chunk: string) {
    this.preview = chunk;
  }

  getColor(chunk: string) {
    if (chunk === this.preview) {
      return 'pink';
    }
    return ((this.splitContent.chunks.indexOf(chunk) % 2) === 0) ? 'beige' : 'white';
  }
}
