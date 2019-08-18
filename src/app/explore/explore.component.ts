import { Component, OnInit } from '@angular/core';
import {NeonGenesisService} from '../service/neon-genesis.service';

@Component({
  selector: 'app-explore',
  template: `
    <p>
      explore works!
    </p>
    <router-outlet></router-outlet>
  `,
  styles: ['']
})
export class ExploreComponent implements OnInit {

  constructor(private neonGenesis: NeonGenesisService) { }

  ngOnInit() {
    this.neonGenesis.getScrollPayItems(0, 10)
      .subscribe(r => console.log(r));
  }

}
