import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interfaces/usuarios';
import { Viaje, Viajes } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-historial-viajes',
  templateUrl: './historial-viajes.page.html',
  styleUrls: ['./historial-viajes.page.scss'],
})
export class HistorialViajesPage implements OnInit {

  usuario: Usuario = {
    correo: '',
    nombre: '',
    contrasena: '',
    rut: '',
    patente: '',
    foto: '',
    viaje: null,
    numero: null,
    tutoriales: {},
  }

  viajes: Viaje[] = [];

  constructor(private _auth: AuthService, private _viaje: ViajesService,
    private _router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.viajes = [];
    this.usuario = await this._auth.getSession();
    //? Obtengo los viajes del usuario
    let viajes: Viajes = this._viaje.get();
    viajes.viajes.forEach(viaje => {
      if (viaje.pasajeros.includes(this.usuario.correo)) {
        let viajeToAdd = viaje;
        viajeToAdd['translatedDate'] = this._viaje.translateDate(new Date(viaje.fecha));
        this.viajes.push(viajeToAdd);
      }
    });
    console.log(this.viajes)
  }

  seeViajeDetails(id) {
    this._router.navigate(['/viaje'], { queryParams: { id: id } });
  }

}
