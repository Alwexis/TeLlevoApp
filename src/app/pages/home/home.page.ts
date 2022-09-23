import { Component } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  usuario = {
    correo: '',
    rut: '',
    nombre: '',
    patente: '',
    foto: '',
    viaje: -1,
  }

  constructor(private router: Router,
    private activatedRouter: ActivatedRoute,
    private menu: MenuController) {
    this.activatedRouter.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.usuario = this.router.getCurrentNavigation().extras.state.usuario;
      }
    })
  }

  changePage(page) {
    let navigationExtras: NavigationExtras = {
      state: {
        usuario: this.usuario,
      }
    }
    this.menu.close('menu');
    page == '/login' ? this.router.navigate([page]) : this.router.navigate([page], navigationExtras);
  }

  verMenu() {
    this.menu.open('menu');
  }

  cerrarMenu() {
    this.menu.close('menu');
  }

}
