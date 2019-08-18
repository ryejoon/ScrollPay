import { Injectable } from '@angular/core';
import {SplitContent} from './SplitContent';
import {SplitPayOption} from '../split/SplitPayOption';

export interface TextSplitOption {
  chunks: number;
}

@Injectable({
  providedIn: 'root'
})
export class TextSplitterService {

  constructor() { }

  public split(option: TextSplitOption, content: string): SplitContent<string, string> {
    const result = new SplitContent<string, string>();
    result.original = content;
    const lines = content.split('\n');
    const linePerChunk: number = Math.floor(lines.length / option.chunks);
    if (linePerChunk === 0) {
      throw new Error(`Text is smaller than split length. Cannot split`);
    }
    let currentChunk = '';
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < lines.length; i++) {
      currentChunk += (lines[i] + '\n');
      if (i !== 0 && ((i % linePerChunk === 0) || i === lines.length)) {
        result.chunks.push(currentChunk);
        currentChunk = '';
      }
    }
    return result;
  }
}
