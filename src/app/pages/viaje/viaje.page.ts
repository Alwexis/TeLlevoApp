import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonDatetime, ModalController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuarios';
import { Viaje } from 'src/app/interfaces/viajes';
import { AuthService } from 'src/app/services/auth.service';
import { ViajesService } from 'src/app/services/viajes.service';
import { Animation, AnimationController } from '@ionic/angular';
import { AgendarStatus } from 'src/app/enums/agendar-status';
import { ValoracionService } from 'src/app/services/valoracion.service';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {

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
    descripcion: '',
    conductor: null,
    pasajeros: [],
    valoraciones: [],
    estatus: null,
  };

  conductor: Usuario = {
    correo: '',
    contrasena: '',
    rut: '',
    nombre: '',
    patente: '',
    foto: '',
    viaje: null,
    numero: null,
  }

  valoracion = {
    calificacion: 0,
    comentario: '',
  }

  pasajeros: Usuario[] = [];

  @ViewChild('fecha') fecha: IonDatetime;
  @ViewChild('calificacion') calificacion: number;
  hoy = new Date().toISOString();

  gotTheRide = false;
  hasDisplayedPasajeros = false;
  didQualified;

  constructor(private _router: Router, private _route: ActivatedRoute, 
    private _auth: AuthService, private _viajes: ViajesService,
    private _modalCtrl: ModalController, private _toastCtrl: ToastController,
    private _animCtrl: AnimationController, private _valoracion: ValoracionService) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.pasajeros = [];
    this.usuario = await this._auth.getSession();
    this._route.queryParams.subscribe(async (params) => {
      if (params) {
        this.viaje = await this._viajes.getViaje(parseInt(params['id']));
        this.conductor = this._auth.getUser(this.viaje.conductor) as Usuario;
        this.viaje.pasajeros.forEach(pasajero => {
          this.pasajeros.push(this._auth.getUser(pasajero) as Usuario);
        });
        const fecha = new Date(this.viaje.fecha);
        this.viaje['translatedDate'] = this._viajes.translateDate(fecha);
        this.gotTheRide = this.viaje.pasajeros.includes(this.usuario.correo);
        this.didQualified = this._valoracion.userDidRate(this.usuario.correo, this.viaje.id);
      }
    });
    //this.viaje = this._viajes.getViaje(id)
  }

  async onSubmit() {
    this.viaje.fecha = new Date(this.fecha.value.toString())
    let edited = await this._viajes.editViaje(this.viaje, this.usuario);
    if (edited) {
      let toast = await this._toastCtrl.create({
        message: '¡Has modificado tu Viaje!',
        duration: 2000,
        icon: 'sparkles-outline'
      });
      await toast.present();
      this.closeModal();
      await this.loadData();
    } else {
      let toast = await this._toastCtrl.create({
        message: 'No se ha podido modificar tu Viaje',
        duration: 2000,
        icon: 'sad-outline'
      });
      await toast.present();
    }
  }

  async displayPasajeros() {
    let animacion = this._animCtrl.create()
    .addElement(document.getElementsByClassName('pasajeros-details')[0])
    .duration(100)
    if (this.hasDisplayedPasajeros) {
      this.hasDisplayedPasajeros = false;
      animacion.fromTo('transform', 'rotate(90deg)', 'rotate(0deg)');
      await animacion.play();
    } else {
      this.hasDisplayedPasajeros = true;
      animacion.fromTo('transform', 'rotate(0deg)', 'rotate(90deg)');
      await animacion.play();
    }
  }

  goToProfile(correo: string) {
    this._router.navigate(['/perfil-otros'], {queryParams: {correo: correo}});
  }

  async reservar() {
    let isDone = await this._viajes.getRide(this.viaje.id, this.usuario);
    if (isDone === AgendarStatus.DONE) {
      let toast = await this._toastCtrl.create({
        message: 'Viaje Agendado!',
        duration: 1500,
        icon: 'checkmark-circle-outline'
      });
      await toast.present();
      await this.loadData();
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

  async cancelarReserva() {
    let cancelado = await this._viajes.cancelRide(this.viaje.id, this.usuario);
    if (cancelado) {
      const toast = await this._toastCtrl.create({
        message: 'Has cancelado tu reserva',
        duration: 1500,
        position: 'bottom',
        icon: "close-circle-outline"
      });
      await toast.present();
      await this.loadData();
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

  async cancelarViaje() {
    let cancelado = await this._viajes.cancelViaje(this.viaje.id, this.usuario);
    if (cancelado) {
      const toast = await this._toastCtrl.create({
        message: 'Has cancelado tu viaje',
        duration: 1500,
        position: 'bottom',
        icon: "close-circle-outline"
      });
      await toast.present();
      await this.loadData();
    } else {
      const toast = await this._toastCtrl.create({
        message: 'No se pudo cancelar tu viaje',
        duration: 1500,
        position: 'bottom',
        icon: "alert-circle-outline"
      });
      await toast.present();
    }
  }

  pinFormatter(value: number) {
    return `${Math.round(value/10)}`;
  }

  async valorarViaje() {
    this.valoracion.calificacion = Math.round(this.calificacion['value'] / 10)
    this._valoracion.addValoracion(this.viaje, this.usuario, this.valoracion.calificacion, this.valoracion.comentario);
    this._modalCtrl.getTop().then(modal => modal.dismiss());
    await this.loadData();
    const toast = await this._toastCtrl.create({
      message: '¡Has valorado el Viaje!',
      duration: 1500,
      position: 'bottom',
      icon: "star-outline"
    });
    await toast.present();
    this._router.navigate(['/historial-viajes']);
  }

  closeModal() {
    this._modalCtrl.getTop().then(modal => modal.dismiss());
  }

}
