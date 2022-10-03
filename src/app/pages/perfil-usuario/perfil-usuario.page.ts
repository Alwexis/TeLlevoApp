import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
})
export class PerfilUsuarioPage implements OnInit {

  usuario;

  constructor(private _modalCtrl: ModalController, private _router: Router,
    private _activatedRouter: ActivatedRoute, private _alertCtrl: AlertController,
    private _toastCtrl: ToastController) {
    this._activatedRouter.queryParams.subscribe(() => {
      if (this._router.getCurrentNavigation().extras.state) {
        this.usuario = this._router.getCurrentNavigation().extras.state.usuario;
      }
    })
  }

  ngOnInit() {
  }

  tabButtonChangePage(page) {
    this._router.navigate([page], this.usuario);
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
            this._modalCtrl.getTop().then(modal => modal.dismiss());
            this.tabButtonChangePage('perfil');
          },
        }],
      });
      await alert.present();
    } else {
      const alert = await this._alertCtrl.create({
        header: '¡Sólo queda un paso!',
        //subHeader: '',
        message: 'Para ser conductor, debes ingresar la patente de tu medio de transporte (incluyendo guiones). Presiona "OK" para continuar una vez lo hayas hecho. Por otro lado, preciona "cancelar" para volver al perfil.',
        mode: 'ios',
        buttons: [{
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
            this.tabButtonChangePage('perfil');
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (alertData) => {
            let formato = /([a-zA-ZñÑ]{2})-(([a-zA-ZñÑ]|[0-9]){2})-([0-9]{2})/;
            alert.dismiss();
            if (formato.test(alertData.patente)) {
              this.usuario.patente = alertData.patente.toUpperCase();
              this.sendToast('¡Bienvenido a bordo! Ahora eres conductor de TeLlevoApp.');
              this._modalCtrl.getTop().then(modal => modal.dismiss());
              this.tabButtonChangePage('perfil');
            } else {
              this.sendToast('Ha ocurrido un error procesando la patente.');
            }
          },
        }],
        inputs: [{
          name: 'patente',
          type: 'text',
          /* El Label sólo sirve para inputs radio o checkbox
          label: 'Patente (incluyendo guiones)',
          */
          placeholder: 'AA-BB-11',
          attributes: {
            maxlength: 8,
          }
        }],
      });
      await alert.present();
    }
  }

  async sendToast(msg) {
    const toast = await this._toastCtrl.create({
      message: msg,
      duration: 3000,
    });
    await toast.present();
  }
}
