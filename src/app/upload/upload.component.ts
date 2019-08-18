/* tslint:disable:prefer-for-of */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileSnippet, ImageService, ResizedImage} from '../service/image.service';
import {TextSplitOption, TextSplitterService} from '../service/splitter/text-splitter.service';

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
      <div #textContentElem fxLayout="column">
      </div>
  `,
  styles: ['input {width: 100%}']
})
export class UploadComponent implements OnInit {
  @ViewChild('textContentElem', {static: true}) textContentElem: ElementRef;
  payToAddress: string;
  textSplitOption: TextSplitOption = {
    chunks: 10
  };

  constructor(private imageService: ImageService, private textSplitter: TextSplitterService) { }

  ngOnInit() {
  }


  processText(textInput: HTMLInputElement) {
    const file: File = textInput.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      const content = event.target.result;
      const splitResult = this.textSplitter.split(this.textSplitOption, content);
      console.log(splitResult);
      splitResult.chunks.forEach(chunk => {
        chunk.split('\n')
        const textNode = document.createElement('textarea');
        textNode.appendChild(document.createTextNode(chunk));
        // toggle background color
        if (splitResult.chunks.indexOf(chunk) % 2 === 0) {
          textNode.style.backgroundColor = 'beige';
        }
        this.textContentElem.nativeElement.appendChild(textNode);
      });
    });
    reader.readAsText(file, 'utf-8');
  }
}
