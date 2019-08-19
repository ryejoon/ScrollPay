import { TestBed } from '@angular/core/testing';

import { PaidStoreService } from './paid-store.service';

describe('PaidStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PaidStoreService = TestBed.get(PaidStoreService);
    expect(service).toBeTruthy();
  });
});
