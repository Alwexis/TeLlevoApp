import { Time } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonDatetime, ModalController, ToastController } from '@ionic/angular';
import { text } from 'cheerio/lib/api/manipulation';
import { Usuario } from 'src/app/interfaces/usuarios';
import { Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { ViajesService } from 'src/app/services/viajes.service';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {

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

  viaje: Viaje = {
    id: null,
    fecha: null,
    destino: '',
    precio: null,
    capacidad: null,
    descripcion: null,
    conductor: this.usuario,
    pasajeros: [],
    valoraciones: [],
    estatus: null,
  }

  hoy = new Date().toISOString();

  constructor(private _modalCtrl: ModalController, private _toastCtrl: ToastController,
    private _auth: AuthService, private _viajes: ViajesService,
    private _router: Router) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.usuario = await this._auth.getSession();
  }

  async onSubmit() {
    this.viaje.conductor = this.usuario;
    let wasScheduled = await this._viajes.scheduleViaje(this.viaje);
    if (wasScheduled) {
      this._modalCtrl.dismiss('un_viaje', 'confirmar');
      let buttons = [{
        text: 'Lista de Viajes',
        role: 'lista_de_viajes',
        handler: () => { this._router.navigate(['/tus-viajes']); }
      }]
      this.sendToast('¡Viaje programado! Puedes verlo en tu lista de Viajes', 'today-outline', buttons);
    } else {
      this.sendToast('Ha ocurrido un error. Inténtalo de nuevo', 'alert-circle-outline');
    }
  }

  async sendToast(msg: string, icon: string = undefined, buttons = undefined) {
    const toast = await this._toastCtrl.create({
      message: msg,
      duration: 3000,
    });
    if (icon != undefined) toast.icon = icon;
    if (buttons != undefined) toast.buttons = buttons;
    await toast.present();
  }

  //! Mover a otro archivo
  /*
  translateDate(date: Date) {
    let dia = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][date.getDay()];
    let mes = ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][date.getMonth()];
    let diaNum = date.getDate();
    let horas = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    let minutos = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    return `${dia} ${diaNum} de ${mes}. ${horas}:${minutos}`;
  }
  */
}
