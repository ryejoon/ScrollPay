import { TestBed } from '@angular/core/testing';

import { TextSplitterService } from './text-splitter.service';

describe('TextSplitterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextSplitterService = TestBed.get(TextSplitterService);
    expect(service).toBeTruthy();
  });
});
