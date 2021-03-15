import { TestBed } from '@angular/core/testing';

import { FilesService } from './files.service';

describe('FileServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilesService = TestBed.get(FilesService);
    expect(service).toBeTruthy();
  });
});
