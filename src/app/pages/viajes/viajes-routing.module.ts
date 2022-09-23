import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajesPage } from './viajes.page';

const routes: Routes = [
  {
    path: '',
    component: ViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajesPageRoutingModule {}
