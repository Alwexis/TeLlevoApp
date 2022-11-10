import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage-angular';

import { ValoracionService } from './valoracion.service';

describe('ValoracionService', () => {
  let service: ValoracionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), HttpClientModule]
    });
    service = TestBed.inject(ValoracionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
