import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime, IonModal, ModalController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuarios';
import { Viaje } from 'src/app/interfaces/viajes';
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
    tutoriales: {},
  }

  viajes = [];

  viaje: Viaje = {
    id: null,
    fecha: null,
    destino: '',
    precio: null,
    capacidad: null,
    descripcion: '',
    conductor: null,
    pasajeros: [],
    valoraciones: [],
    estatus: null,
  };

  constructor(private _router: Router, private _auth: AuthService,
    private _viajes: ViajesService) {
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.usuario = await this._auth.getSession();
    this._viajes.get().viajes.forEach(viaje => {
      if (viaje.conductor === this.usuario.correo) {
        let viajeRaw = viaje;
        viajeRaw['translatedDate'] = this._viajes.translateDate(new Date(viajeRaw.fecha.toString()));
        this.viajes.push(viajeRaw);
      }
    })
  }

  seeViajeDetails(id) {
    this._router.navigate(['/viaje'], { queryParams: { id: id } });
  }

}
