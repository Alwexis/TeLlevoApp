import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-tus-viajes',
  templateUrl: './tus-viajes.page.html',
  styleUrls: ['./tus-viajes.page.scss'],
})
export class TusViajesPage implements OnInit {

  usuario: Usuario = {
    correo: '',
    contrasena: '',
    rut: '',
    nombre: '',
    patente: '',
    foto: '',
    viaje: null,
    numero: null,
  }

  viajes = [];

  constructor(private _router: Router, private _auth: AuthService,
    private _viajes: ViajesService) {
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.usuario = await this._auth.getSession();
    this._viajes.get().viajes.forEach(viaje => {
      if (viaje.conductor.correo === this.usuario.correo) {
        let viajeRaw = viaje;
        viajeRaw['translatedDate'] = this._viajes.translateDate(new Date(viajeRaw.fecha.toString()));
        this.viajes.push(viajeRaw);
      }
    })
  }



}
