import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { Usuarios } from '../interfaces/usuarios';
import { EncrypterService } from './encrypter.service';
import { StorageService } from './storage.service';
import { LoginState } from '../enums/login-state';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Session } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  userData: Usuarios;
  session: Session;

  constructor(private _storage: StorageService, private _encrypt: EncrypterService,
    private _router: Router, private _toastCtrl: ToastController) {
    this.loadData();
  }

  async loadData() {
    this.userData = await this._storage.getData('usuarios');
    if (this.userData == undefined || this.userData == null) {
      this.userData = await this._storage.addData('usuarios', { users: new Map<string, {}>() });
    }
    return this.userData;
  }

  getSession() {
    return this.session;
  }

  async logout() {
    await this._storage.removeData('session', 0);
    this._router.navigate(['/login']);
    let toast = await this._toastCtrl.create({
      message: '¡Hasta pronto!',
      duration: 2000,
      icon: 'exit-outline'
    });
    await toast.present();
  }

  async login(credentials: {}) {
    // USER_NOT_FOUND -> Usuario no existe
    // BAD_CREDENTIALS -> Datos erroneos
    // LOGGED_IN -> Logeado correctamente :]
    if (this.userData.users.has(credentials['correo'])) {
      let user: Usuario = this.userData.users.get(credentials['correo']) as Usuario;
      console.log(user)
      this._encrypt.encrypt(credentials['contrasena']).subscribe(async (encryptedPwd) => {
        if (user.contrasena == encryptedPwd['Digest']) {
          this.session = await this._storage.addData('session', user);
          this._router.navigate(['/home']);
          let toast = await this._toastCtrl.create({
            message: '¡Bienvenido de vuelta!',
            duration: 2000,
            icon: 'enter-outline'
          });
          await toast.present();
          return LoginState.LOGGED_IN;
        } else {
          return LoginState.BAD_CREDENTIALS;
        }
      });
    }
    return LoginState.USER_NOT_FOUND;
  }

  async registerUser(credentials: {}) {
    let user: Usuario = {
      correo: credentials['correo'] + credentials['extension'],
      rut: credentials['rut'],
      nombre: credentials['nombre'],
      contrasena: '',
      patente: credentials['patente'],
      foto: '',
    }
    if (!this.userData.users.has(user.correo)) {
      this._encrypt.encrypt(credentials['contrasena']).subscribe(async (data) => {
        user.contrasena = data['Digest'];
        this.userData.users.set(user.correo, user);
        await this._storage.addData('usuarios', this.userData);
        await this._storage.addData('session', user);
      });
      return true;
    } else {
      return false;
    }
  }
}
