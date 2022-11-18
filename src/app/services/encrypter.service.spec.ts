import { TestBed } from '@angular/core/testing';

import { EncrypterService } from './encrypter.service';

describe('EncrypterService', () => {
  let service: EncrypterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EncrypterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
