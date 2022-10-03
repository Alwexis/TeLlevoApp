import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TusViajesPageRoutingModule } from './tus-viajes-routing.module';

import { TusViajesPage } from './tus-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TusViajesPageRoutingModule
  ],
  declarations: [TusViajesPage]
})
export class TusViajesPageModule {}
