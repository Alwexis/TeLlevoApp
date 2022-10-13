import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private _router: Router, private _menu: MenuController,
    private _auth: AuthService) {
      this.loadData();
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.usuario = await this._auth.getSession();
  }
  
  async changePage(page) {
    this._menu.close('menu');
    page == '/login' ? await this._auth.logout() : this._router.navigate([page]);
  }

  verMenu() {
    this._menu.open('menu');
  }

  cerrarMenu() {
    this._menu.close('menu');
  }

}
