import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoginState } from 'src/app/enums/login-state';
import { Usuario } from 'src/app/interfaces/usuario';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: Usuario;
  userData: Usuarios;
  credenciales = {
    correo: '',
    contrasena: '',
  }
  // El guión bajo en las variables es una convención para indicar que es una variable privada.
  constructor(private _alertCtrl: AlertController, private _auth: AuthService) { }

  ngOnInit() {
  }

  async onSubmit() {
    let auth = await this._auth.login(this.credenciales);
    const alert = await this._alertCtrl.create({ header: '¡Error!', buttons: ['OK'], mode: 'ios', cssClass: 'datoserroneos', });
    switch (auth) {
      case LoginState.USER_NOT_FOUND:
        alert.subHeader = 'Usuario no encontrado';
        alert.message = 'El correo electrónico que ha ingresado no está registrado. Por favor, intente nuevamente.';
        await alert.present();
        break;
      case LoginState.BAD_CREDENTIALS:
        alert.subHeader = 'Usuario y/o contraseña incorrectos';
        alert.message = 'Los datos que ha ingresado son incorrectos. Por favor, intente nuevamente.';
        await alert.present();
        break;
      default:
        break;
    }
  }
}