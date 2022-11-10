import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { HistorialViajesPage } from './historial-viajes.page';

describe('HistorialViajesPage', () => {
  let component: HistorialViajesPage;
  let fixture: ComponentFixture<HistorialViajesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistorialViajesPage ],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), HttpClientModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(HistorialViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
