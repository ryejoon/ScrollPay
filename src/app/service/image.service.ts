import { Injectable } from '@angular/core';
import {Const} from '../const';
import * as CryptoJS from 'crypto-js';
import {Observable} from 'rxjs';

declare var datapay: any;
declare var imageCompression: any;

export interface UploadedImageInfo {
  cHash: string;
  filetype: string;
  filename: string;
}

export interface ResizedImage {
  reader: FileReader;
  resizedImg: HTMLImageElement;
  cHash: string;
  fileType: string;
  fileName: string;
}

export class FileSnippet {
  constructor(public src: string, public file: File) {}
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }


  /*processImage(imageInput: HTMLInputElement) {
    for (let i = 0; i < imageInput.files.length; i++) {
      const file: File = imageInput.files[i];
      const reader = new FileReader();
      reader.addEventListener('load', (event: any) => {
        const img = new FileSnippet(event.target.result, file);
        this.compressImage(img)
          .then(r => {
            this.textContentElem.nativeElement.appendChild(r.resizedImg);
            this.resizedImages.push(r);
          });
      });
      reader.readAsDataURL(file);
    }
  }*/


  async compressImage(fileSnippet: FileSnippet): Promise<ResizedImage> {
    const response: ResizedImage = {
      reader: null, resizedImg: null, cHash: null
      , fileType: fileSnippet.file.type, fileName: fileSnippet.file.name
    };

    const options = {
      maxSizeMB: 0.09,
      maxWidthOrHeight: 800,
      useWebWorker: true
    };

    response.reader = new FileReader();
    const resizedImg: HTMLImageElement = new Image();
    response.resizedImg = resizedImg;
    await imageCompression(fileSnippet.file, options)
      .then((imgBlob: Blob) => {
        response.reader.addEventListener('load', (event: any) => {
          resizedImg.src = URL.createObjectURL(imgBlob);
          resizedImg.onload = () =>
            response.cHash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(event.target.result)).toString();
        });
        response.reader.readAsArrayBuffer(imgBlob);
      });
    return response;
  }

  buildImageFileTx(privateKey: string, image: ResizedImage) {
    const data = [
      Const.B_PROTOCOL,
      image.reader.result,
      image.fileType,
      'binary'
    ];

    const tx = {
      safe: true,
      data,
      pay: {
        key: privateKey,
        rpc: 'https://api.bitindex.network',
        feeb: 1.04
      }
    };

    return new Observable(subscriber => {
      setTimeout(() => subscriber.error('Payment Timeout'), 10000);
      datapay.send(tx, (err, res) => {
        if (err) {
          subscriber.error(err);
        }
        subscriber.next(res);
        subscriber.complete();
      });
    });
  }
}
