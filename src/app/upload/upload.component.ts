/* tslint:disable:prefer-for-of */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FileSnippet, ImageService, ResizedImage} from '../service/image.service';

@Component({
  selector: 'app-upload',
  template: `
    <div>
      <input id="file-input" #imageInput type="file" (change)="processImage(imageInput)"
             accept="image/*" multiple="true" style="width: 100%"/>
        <div #mainElem>
            <!--<div *ngFor="let img of resizedImages">
                <img src="{{img.resizedImg.src}}">
            </div>-->
        </div>
    </div>
  `,
  styles: []
})
export class UploadComponent implements OnInit {
  resizedImages: ResizedImage[] = [];
  @ViewChild('mainElem', {static: true}) mainElem: ElementRef;

  constructor(private imageService: ImageService) { }

  ngOnInit() {
  }

  processImage(imageInput: HTMLInputElement) {
    for (let i = 0; i < imageInput.files.length; i++) {
      const file: File = imageInput.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        const img = new FileSnippet(event.target.result, file);
        this.imageService.compressImage(img)
          .then(r => {
            this.mainElem.nativeElement.appendChild(r.resizedImg);
            this.resizedImages.push(r);
          });
      });
      reader.readAsDataURL(file);
    }
  }
}
