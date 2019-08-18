import { TestBed } from '@angular/core/testing';

import { FileUploaderService } from './file-uploader.service';

describe('FileUploaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileUploaderService = TestBed.get(FileUploaderService);
    expect(service).toBeTruthy();
  });
});
