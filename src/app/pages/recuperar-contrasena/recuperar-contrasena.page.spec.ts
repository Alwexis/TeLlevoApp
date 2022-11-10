import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { RecuperarContrasenaPage } from './recuperar-contrasena.page';

describe('RecuperarContrasenaPage', () => {
  let component: RecuperarContrasenaPage;
  let fixture: ComponentFixture<RecuperarContrasenaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperarContrasenaPage ],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), HttpClientModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
