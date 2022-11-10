import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage-angular';

import { SessionGuard } from './session.guard';

describe('SessionGuard', () => {
  let guard: SessionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IonicStorageModule.forRoot(), HttpClientModule]
    });
    guard = TestBed.inject(SessionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
