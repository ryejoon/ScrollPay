import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import * as bsv from 'bsv';
import {first} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Const, Hosts} from '../const';

declare var Buffer;

@Injectable({
  providedIn: 'root'
})
export class BitindexService {

  constructor(private http: HttpClient) {
  }

  options = {headers: {api_key: Const.bitIndexApiKey}};

  public getUtxos(addr: string): Promise<any> {
    return this.http.get(Hosts.bitIndexApiHost + `addr/${ addr }/utxo`, this.options)
      .toPromise();
  }

  public get(addr: string): Promise<any> {
    return this.getObservable(addr)
      .pipe(first())
      .toPromise();
  }

  public getObservable(addr: string): Observable<any> {
    return this.http.get(Hosts.bitIndexApiHost + `addr/${ addr }`, this.options);
  }

  public buildTx(addr: string, data: any[]) {
    return this.getUtxos(addr)
      .then(utxos => utxos.map(bsv.Transaction.UnspentOutput))
      .then(utxos => {
        const tx = new bsv.Transaction().change(addr);
        const script  = new bsv.Script();
        let fee = 0;

        // https://bitcoinsv.io/2019/07/27/the-return-of-op_return-roadmap-to-genesis-part-4/
        // script.add(bsv.Opcode.OP_FALSE);
        // Add OP_RETURN output
        script.add(bsv.Opcode.OP_RETURN);
        data.forEach(item => {
          // Hex string
          if (typeof item === 'string' && /^0x/i.test(item)) {
            script.add(Buffer.from(item.slice(2), 'hex'));
            // Opcode number
          } else if (typeof item === 'number') {
            script.add(item);
            // Opcode
          } else if (typeof item === 'object' && item.hasOwnProperty('op')) {
            script.add({ opcodenum: item.op });
            // All else
          } else {
            script.add(Buffer.from(item));
          }
        });
        tx.addOutput(new bsv.Transaction.Output({ script, satoshis: 0 }));

        // Incrementally add utxo until sum of inputs covers fee + dust
        utxos.some(utxo => {
          tx.from(utxo);
          fee = tx._estimateFee();
          return this.inputSum(tx) >= fee + 546;
        });
        tx.fee(fee);
        return tx;
      });
  }

  public sendTx(tx): Promise<any> {
    const rawtx = tx.toString();
    return this.http.post(Hosts.bitIndexApiHost + 'tx/send', { rawtx }, this.options)
      .toPromise();
  }

  inputSum(tx) {
    return tx.inputs.reduce((acc, input) => {
      return acc + input.output.satoshis;
    }, 0);
  }
}
