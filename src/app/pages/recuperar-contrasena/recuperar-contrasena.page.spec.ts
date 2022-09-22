import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecuperarContrasenaPage } from './recuperar-contrasena.page';

describe('RecuperarContrasenaPage', () => {
  let component: RecuperarContrasenaPage;
  let fixture: ComponentFixture<RecuperarContrasenaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RecuperarContrasenaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarContrasenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
