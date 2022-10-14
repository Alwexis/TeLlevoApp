import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { last } from 'cheerio/lib/api/traversing';
import { Usuario } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  usuario: Usuario = {
    correo: '',
    nombre: '',
    contrasena: '',
    rut: '',
    patente: '',
    foto: '',
    viaje: null,
    numero: null
  };

  lastViajes = [];

  constructor(private _router: Router, private _menu: MenuController,
    private _auth: AuthService, private _viajes: ViajesService) { }

  ngOnInit() {
    this.cerrarMenu();
    this.loadData();
  }

  async loadData() {
    this.usuario = await this._auth.getSession();
    let viajes = this._viajes.get();
    let viajesArray = Array.from(viajes.viajes.values()).filter(x => x.conductor.correo != this.usuario.correo);
    let stop = false; let i = 1;
    while (!stop) {
      let last: number;
      if (viajesArray.length > i - 1 && viajesArray.length < 3 && last != i) {
        let viaje = viajesArray[viajesArray.length - i];
        viaje['translatedDate'] = this._viajes.translateDate(new Date(viaje.fecha.toString()));
        this.lastViajes.push(viaje);
        last = i;
      } else {
        stop = true;
      }
      i++;
    }
    //! Obsoleto, cambiado por la 'función' de arriba
    /*
    if (viajesArray.length > 0) {
      let viajeRaw = viajesArray[viajesArray.length - 1];
      viajeRaw['translatedDate'] = this._viajes.translateDate(new Date(viajeRaw.fecha.toString()));
      this.lastViajes.push(viajeRaw);
      if (viajesArray.length > 1) {
        let viajeRaw2 = viajesArray[viajesArray.length - 2];
        viajeRaw2['translatedDate'] = this._viajes.translateDate(new Date(viajeRaw2.fecha.toString()));
        this.lastViajes.push(viajeRaw2);
      }
    }
    */
  }

  async changePage(page) {
    this.cerrarMenu();
    page == '/login' ? await this._auth.logout() : this._router.navigate([page]);
  }

  verMenu() {
    this._menu.open('menu');
  }

  cerrarMenu() {
    this._menu.close('menu');
  }

}
