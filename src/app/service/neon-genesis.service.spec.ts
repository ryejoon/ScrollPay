import { TestBed } from '@angular/core/testing';

import { NeonGenesisService } from './neon-genesis.service';

describe('NeonGenesisService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeonGenesisService = TestBed.get(NeonGenesisService);
    expect(service).toBeTruthy();
  });
});
