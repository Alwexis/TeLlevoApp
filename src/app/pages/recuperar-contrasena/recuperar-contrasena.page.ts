import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
})
export class RecuperarContrasenaPage implements OnInit {

  datos = {
    correo: '',
    codigo: '',
    contrasena: '',
    contrasena2: '',
  }

  codigoAutorizacion = '';

  constructor(private _router: Router, private _alertCtrl: AlertController,
    private _auth: AuthService) { }

  ngOnInit() {
  }

  async generateCode() {
    if (this.codigoAutorizacion == '') {
      this.codigoAutorizacion = Math.random().toString(36).substring(2,9).toUpperCase();
      console.log(this.codigoAutorizacion);
      let username = this._auth.getUser(this.datos.correo);
      (await this._auth.recoverPassword(this.datos.correo, this.codigoAutorizacion, username['nombre'])).subscribe(e => {
      })
    }
  }

  async onSubmit(form: NgForm) {
    let user = this._auth.getUser(this.datos.correo);
    await this._auth.changePassword(user as Usuario, this.datos.contrasena);
    const alert = await this._alertCtrl.create({
      header: '¡Éxito!',
      subHeader: 'Cambiaste tu contraseña',
      message: 'Has cambiado tu contraseña con éxito. Volverás al menú de inicio de sesión al apretar "OK".',
      backdropDismiss: false,
      buttons: [{
          text: 'OK',
          role: 'ok',
          handler: () => {
            this._router.navigate(['/login']);
            form.reset();
          },
      }],
      mode: 'ios',
      // Las alertas son componentes globales, por lo que para editar su CSS por ejemplo, hay que editarlo en el archivo
      // global.scss que está en la carpeta src.
    });

    await alert.present();
  }

}
