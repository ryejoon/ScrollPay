import { TestBed } from '@angular/core/testing';

import { ScrollpayStoreService } from './scrollpay-store.service';

describe('ScrollpayStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollpayStoreService = TestBed.get(ScrollpayStoreService);
    expect(service).toBeTruthy();
  });
});
