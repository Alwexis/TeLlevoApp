import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilOtrosPage } from './perfil-otros.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilOtrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilOtrosPageRoutingModule {}
