import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Session } from 'src/app/interfaces/session';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  session: Session;
  usuario: Usuario;

  constructor(private _router: Router, private _menu: MenuController,
    private _auth: AuthService) {
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.session = await this._auth.getSession();
    this.usuario = {
      correo: this.session['correo'],
      nombre: this.session['nombre'],
      contrasena: this.session['contrasena'],
      rut: this.session['rut'],
      patente: this.session['patente'] || '',
      foto: this.session['foto'],
      viaje: this.session['viaje'],
    }
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
