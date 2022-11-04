import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TusViajesPage } from './tus-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: TusViajesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TusViajesPageRoutingModule {}
