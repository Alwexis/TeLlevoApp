import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage-angular';

import { ViajesService } from './viajes.service';

describe('ViajesService', () => {
  let service: ViajesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), HttpClientModule]
    });
    service = TestBed.inject(ViajesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
