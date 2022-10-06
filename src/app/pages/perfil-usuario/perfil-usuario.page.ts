import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  usuario: Usuario = {
    correo: '',
    contrasena: '',
    rut: '',
    nombre: '',
    patente: '',
    foto: '',
    viaje: null,
  }

  constructor(private _modalCtrl: ModalController, private _router: Router,
    private _alertCtrl: AlertController, private _toastCtrl: ToastController,
    private _auth: AuthService) {
  }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.usuario = await this._auth.getSession();
  }

  async changeDriverStatus() {
    if (this.usuario.patente != '') {
      this.usuario.patente = ''
      const alert = await this._alertCtrl.create({
        header: '¡Hasta pronto!',
        subHeader: 'Dejaste de ser Conductor',
        message: 'Decidiste dejar de ser conductor, lamentamos esa decisión, pero esperamos que vuelvas pronto. Presiona "OK" para continuar.',
        mode: 'ios',
        buttons: [{
          text: 'OK',
          role: 'confirm',
          handler: () => {
            alert.dismiss();
            this.closeModal();
            this._router.navigate(['/perfil']);
          },
        }],
      });
      await alert.present();
    } else {
      const alert = await this._alertCtrl.create({
        header: '¡Sólo queda un paso!',
        message: 'Para ser conductor, debes ingresar la patente de tu medio de transporte (incluyendo guiones). Presiona "OK" para continuar una vez lo hayas hecho. Por otro lado, preciona "cancelar" para volver al perfil.',
        mode: 'ios',
        buttons: [{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
            this._router.navigate(['/perfil']);
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (alertData) => {
            alert.dismiss();
            if (this.checkPatenteFormat(alertData.patente)) {
              this.usuario.patente = this.checkPatenteFormat(alertData.patente) ? alertData.patente.toUpperCase() : this.formatPatente(alertData.patente).toUpperCase();
              this.sendToast('¡Bienvenido a bordo! Ahora eres conductor de TeLlevoApp.');
              this.closeModal();
              this._router.navigate(['/perfil']);
            } else {
              this.sendToast('Ha ocurrido un error procesando la patente.');
            }
          },
        }],
        inputs: [{
          name: 'patente',
          type: 'text',
          placeholder: 'AA-BB-11',
          attributes: {
            maxlength: 8,
          }
        }],
      });
      await alert.present();
    }
  }

  checkPatenteFormat(patente) {
    let formato = /([a-zA-ZñÑ]{2})-(([a-zA-ZñÑ]|[0-9]){2})-([0-9]{2})/;
    if (formato.test(patente)) {
      return true;
    } else {
      patente = this.formatPatente(patente);
      if (formato.test(patente)) {
        return true;
      } else {
        return false
      }
    }
  }

  formatPatente(patente) {
    let newPatente = patente.replace(/\B(?=([a-zA-ZñÑ0-9]{2})+(?!\d))/g, "-");
    return newPatente
  }

  async sendToast(msg) {
    const toast = await this._toastCtrl.create({
      message: msg,
      duration: 3000,
    });
    await toast.present();
  }

  closeModal() {
    this._modalCtrl.getTop().then(modal => modal.dismiss());
  }

  logout() {
    this._auth.logout();
  }
}
