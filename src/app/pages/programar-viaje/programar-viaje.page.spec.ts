import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { ProgramarViajePage } from './programar-viaje.page';

describe('ProgramarViajePage', () => {
  let component: ProgramarViajePage;
  let fixture: ComponentFixture<ProgramarViajePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramarViajePage ],
      imports: [IonicModule.forRoot(), IonicStorageModule.forRoot(), HttpClientModule, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramarViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
