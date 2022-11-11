import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuarios';
import { Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { ViajesService } from 'src/app/services/viajes.service';

import SwiperCore, { Pagination } from 'swiper';
import { IonicSlides } from '@ionic/angular';
import { AgendarStatus } from 'src/app/enums/agendar-status';

SwiperCore.use([Pagination, IonicSlides]);

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
    numero: null,
  };

  lastViajes = [];

  viajeActual: Viaje = {
    id: null, fecha: null, destino: '', precio: null, capacidad: null, descripcion: '', conductor: null, pasajeros: [], valoraciones: [], estatus: null,
  }

  viajesUsuario: Viaje[] = [];

  constructor(private _router: Router, private _menu: MenuController,
    private _auth: AuthService, private _viajes: ViajesService,
    private _toastCtrl: ToastController) { }

  async ngOnInit() {
    await this.loadData();
    this.cerrarMenu();
  }

  async loadData() {
    // Eliminar datos anteriores
    this.lastViajes = [];
    this.viajesUsuario = [];
    // Recargar datos
    await this._auth.refreshUsers();
    this.usuario = await this._auth.getSession();
    // Cargar viaje que tomó el Usuario
    if (this.usuario.viaje != null) {
      this.viajeActual = await this._viajes.getViaje(this.usuario.viaje);
      this.viajeActual['translatedDate'] = this._viajes.translateDate(new Date(this.viajeActual.fecha.toString()));
    }
    // Cargar viajes que el Usuario creó
    if (this.usuario.patente != '') {
      let viajesDelUsuario = await this._viajes.getFrom(this.usuario);
      viajesDelUsuario = viajesDelUsuario.sort((a: Viaje, b: Viaje) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      for (let viaje of viajesDelUsuario) {
        if (this.viajesUsuario.length < 5) {
          let viajeAPushear = viaje;
          viajeAPushear['translatedDate'] = this._viajes.translateDate(new Date(viaje.fecha.toString()));
          this.viajesUsuario.push(viajeAPushear);
        } else { break; }
      }
    }
    let viajes = await this._viajes.get();
    let viajesArray = Array.from(viajes.viajes.values()).filter(viaje => viaje.conductor != this.usuario.correo && viaje.pasajeros.indexOf(this.usuario.correo) == -1);
    if (viajesArray.length > 0) {
      let ultimoViaje;
      // Como no se puede romper un forEach, utilizo una excepción para salir del ciclo.
      const BreakException = {};
      try {
        viajesArray.forEach((viaje, index) => {
          if (index < 5 && ultimoViaje != index) {
            let viajeAMostrar = viaje;
            viajeAMostrar['translatedDate'] = this._viajes.translateDate(new Date(viaje.fecha.toString()));
            this.lastViajes.push(viajeAMostrar);
            ultimoViaje = index;
          } else {
            throw BreakException;
          }
        })
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    }
  }

  async agendar(id) {
    let isDone = await this._viajes.getRide(id, this.usuario);
    if (isDone === AgendarStatus.DONE) {
      let toast = await this._toastCtrl.create({
        message: 'Viaje Agendado!',
        duration: 1500,
        icon: 'checkmark-circle-outline'
      });
      await toast.present();
      this._router.navigate(['/home']);
    } else if (isDone === AgendarStatus.ALREADY_TAKEN) {
      let toast = await this._toastCtrl.create({
        message: 'Ya agendaste este Viaje',
        duration: 3000,
        icon: 'alert-circle-outline',
        buttons: [{
          text: 'Cancelar',
          role: 'cancelarViaje',
          handler: () => { console.log('Viaje cancelado') }
        },
        {
          text: 'Descartar',
          role: 'cancel',
          handler: () => { console.log('Chau') }
        }]
      });
      await toast.present();
    } else {
      let toast = await this._toastCtrl.create({
        message: 'No fue posible agendar este viaje',
        duration: 1500,
        icon: 'sad-outline'
      });
      await toast.present();
    }
  }

  seeViajeDetails(id) {
    this._router.navigate(['/viaje'], { queryParams: { id: id } });
  }

  async cancelarViaje(id) {
    let cancelado = await this._viajes.cancelRide(id, this.usuario);
    if (cancelado) {
      const toast = await this._toastCtrl.create({
        message: 'Has cancelado tu reserva',
        duration: 1500,
        position: 'bottom',
        icon: "close-circle-outline"
      });
      await toast.present();
      this._router.navigate(['/home']);
    } else {
      const toast = await this._toastCtrl.create({
        message: 'No se pudo cancelar tu reserva',
        duration: 1500,
        position: 'bottom',
        icon: "alert-circle-outline"
      });
      await toast.present();
    }
  }

  logout() {
    this.cerrarMenu();
    this._auth.logout();
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
