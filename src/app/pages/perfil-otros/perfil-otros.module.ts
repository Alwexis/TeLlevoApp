import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilOtrosPageRoutingModule } from './perfil-otros-routing.module';

import { PerfilOtrosPage } from './perfil-otros.page';

import { ValoracionComponent } from '../../components/valoracion/valoracion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilOtrosPageRoutingModule,
  ],
  declarations: [PerfilOtrosPage, ValoracionComponent]
})
export class PerfilOtrosPageModule {}
