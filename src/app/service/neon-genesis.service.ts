/* tslint:disable */
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NeonScrollPayResponse} from './response';
import {Const, Hosts} from '../const';

const NEON_ENDPOINT = Hosts.neonGenesisHost + 'q/1HcBPzWoKDL2FhCMbocQmLuFTYsiD73u1j/';
const httpOptions = {
  headers: new HttpHeaders({
    'key':  Const.SCROLLPAY_PROTOCOL
  })
};

@Injectable({
  providedIn: 'root'
})
export class NeonGenesisService {

  constructor(private http: HttpClient) {
  }

// const data = [
//    Const.SCROLLPAY_PROTOCOL,
//    scrollpay.title,
//    scrollpay.description,
//    scrollpay.preview,
//    scrollpay.chunkSha256Hashes.toString(),
//    '|',
//    Const.SPLIT_PROTOCOL,
//    split.payToAddress,
//    split.splitType,
//    split.rangeStart,
//    split.rangeEnd,
//    split.priceUnit,
//    split.price
//    ];

//   export class ScrollPayData {
//   // Scrollpay Protocol
//   title?: string;
//   description: string;
//   preview?: string;
//   chunkHashes?: string;
//
//   // Split Protocol
//   paytoAddress?: string;
//   rangeStart?: number;
//   rangeEnd?: number;
//   priceUnit?: number;
//   price?: number;
// }

  public getScrollPayItems(skip: number, limit: number): Observable<NeonScrollPayResponse> {
    const params = {
      v: 3,
      q: {
        find: {
          'out.s1': Const.SCROLLPAY_PROTOCOL
        },
        skip: skip,
        limit: limit,
        sort: { 'blk.i': 1 }
      },
      r: {
        f: '[.[] | { order: .i, transaction: .tx.h, block: .blk, pushdata: ' +
          '{ b0: "OP_RETURN", s1: .out[0].s1, title: .out[0].s2, description: (.out[0].ls3 // .out[0].s3), ' +
          'preview: (.out[0].ls4 // .out[0].s4), checkHashes: (.out[0].ls5 // .out[0].s5), ' +
          'paytoAddress: .out[0].s8, rangeStart: .out[0].s10, rangeEnd: .out[0].s11, priceUnit: .out[0].s12, price: .out[0].s13} }]'
      }
    };

    return this.http.get<NeonScrollPayResponse>(NEON_ENDPOINT + btoa(JSON.stringify(params)), httpOptions);
  }


}