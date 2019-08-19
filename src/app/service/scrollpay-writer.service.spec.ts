import { TestBed } from '@angular/core/testing';

import { ScrollpayWriterService } from './scrollpay-writer.service';

describe('ScrollpayWriterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollpayWriterService = TestBed.get(ScrollpayWriterService);
    expect(service).toBeTruthy();
  });
});
