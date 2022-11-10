import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { ViajePage } from './viaje.page';

describe('ViajePage', () => {
  let component: ViajePage;
  let fixture: ComponentFixture<ViajePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViajePage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), IonicStorageModule.forRoot(), HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
