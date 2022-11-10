import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { PerfilOtrosPage } from './perfil-otros.page';

describe('PerfilOtrosPage', () => {
  let component: PerfilOtrosPage;
  let fixture: ComponentFixture<PerfilOtrosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilOtrosPage ],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([]), IonicStorageModule.forRoot(), HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilOtrosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
