import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { TusViajesPage } from './tus-viajes.page';

describe('TusViajesPage', () => {
  let component: TusViajesPage;
  let fixture: ComponentFixture<TusViajesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TusViajesPage ],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TusViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
