import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { createAnimation } from '@ionic/core';
import { Usuario } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { ViajesService } from 'src/app/services/viajes.service';
import { ToastController } from '@ionic/angular';
import { AgendarStatus } from '../../enums/agendar-status';

@Component({
  selector: 'app-viajes',
  templateUrl: './viajes.page.html',
  styleUrls: ['./viajes.page.scss'],
})
export class ViajesPage implements OnInit {

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
    private _viajes: ViajesService, private _toastCtrl: ToastController) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.usuario = await this._auth.getSession();
    this._viajes.get().viajes.forEach(viaje => {
      if (viaje.conductor.correo != this.usuario.correo) {
        let viajeRaw = viaje;
        viajeRaw['translatedDate'] = this._viajes.translateDate(new Date(viajeRaw.fecha.toString()));
        viajeRaw['details'] = false;
        viajeRaw['isTaken'] = viaje.pasajeros.filter(pasajero => pasajero.correo === this.usuario.correo).length > 0;
        this.viajes.push(viajeRaw);
      }
    })
  }

  isAvalaible(index) {
    if (this.viajes[index]['isTaken']) {
      return false;
    } if (this.viajes[index]['capacidad'] === this.viajes[index]['pasajeros'].length) {
      return false;
    }
    return true;
  }

  showViajeDetails(index, event) {
    if (this.viajes[index].details) {
      this.viajes[index].details = false;
      event.srcElement.setAttribute("detail-icon", "chevron-forward-outline")
      /*
      ! Esto no va
      const animation = createAnimation()
        .addElement(event.srcElement)
        .duration(1000)
        .fromTo('', '1', '0.5');
      //console.log()
      */
    } else {
      this.viajes[index].details = true;
      event.srcElement.setAttribute("detail-icon", "chevron-down-outline")
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
}
