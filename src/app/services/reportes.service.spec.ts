import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage-angular';

import { ReportesService } from './reportes.service';

describe('ReportesService', () => {
  let service: ReportesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot()]
    });
    service = TestBed.inject(ReportesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
