import { Injectable } from '@angular/core';
import {Const} from '../const';
import * as CryptoJS from 'crypto-js';

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

  async buildImageFileTx(privateKey: string, image: ResizedImage) {
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

    datapay.send(tx, (err, res) => {
      console.log(res);
    });
  }
}
