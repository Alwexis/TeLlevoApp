import { Injectable } from '@angular/core';
import { Usuario, Usuarios } from '../interfaces/usuarios';
import { EncrypterService } from './encrypter.service';
import { StorageService } from './storage.service';
import { LoginState } from '../enums/login-state';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Session } from '../interfaces/session';
import { HttpClient } from '@angular/common/http';
import { DbService } from './db.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: Usuarios;
  session: Session;

  constructor(private _storage: StorageService, private _encrypt: EncrypterService,
    private _router: Router, private _toastCtrl: ToastController, private _alertCtrl: AlertController,
    private _http: HttpClient, private _db: DbService) {
  }

  // ! Hay que actualizar todo el servicio para hacerlo en torno a MongoDB (db.service.ts)
  async loadData() {
    this.session = await this._storage.getData('session');
    this.userData = await this._storage.getData('usuarios');
    if (this.userData == undefined || this.userData == null) {
      this.userData = await this._storage.addData('usuarios', { users: new Map<string, {}>() });
    }
    return this.userData;
  }

  getUser(email: string) {
    return this.userData.users.get(email);
  }

  getUsers() {
    return this.userData.users;
  }

  async getSession() {
    if (this.session == null) {
      this.session = await this._storage.getData('session');
    }
    let user: Usuario = {
      correo: this.session['correo'],
      rut: this.session['rut'],
      nombre: this.session['nombre'],
      contrasena: this.session['contrasena'],
      patente: this.session['patente'],
      foto: this.session['foto'],
      viaje: this.session['viaje'],
      numero: this.session['numero'],
      tutoriales: this.session['tutoriales'],
    }
    return user;
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
    location.reload();
  }

  async login(credentials: {}) {
    const alert = await this._alertCtrl.create({ header: '¡Error!', buttons: ['OK'], mode: 'ios', cssClass: 'datoserroneos', });
    if (this.userData.users.has(credentials['correo'])) {
      let user: Usuario = this.userData.users.get(credentials['correo']) as Usuario;
      this._encrypt.encrypt(credentials['contrasena']).subscribe(async (encryptedPwd) => {
        if (user.contrasena == encryptedPwd['Digest']) {
          this.session = await this._storage.addData('session', user);
          let toast = await this._toastCtrl.create({
            message: '¡Bienvenido de vuelta!',
            duration: 2000,
            icon: 'enter-outline'
          });
          await toast.present();
          this._router.navigate(['/home']);
          return LoginState.LOGGED_IN;
        } else {
          alert.subHeader = 'Usuario y/o contraseña incorrectos';
          alert.message = 'Los datos que ha ingresado son incorrectos. Por favor, intente nuevamente.';
          await alert.present();
          return LoginState.BAD_CREDENTIALS;
        }
      });
    } else {
      alert.subHeader = 'Usuario no encontrado';
      alert.message = 'El correo electrónico que ha ingresado no está registrado. Por favor, intente nuevamente.';
      await alert.present();
      return LoginState.USER_NOT_FOUND;
    }
  }

  async registerUser(credentials: {}) {
    let user: Usuario = {
      correo: credentials['correo'] + credentials['extension'],
      rut: credentials['rut'],
      nombre: credentials['nombre'],
      contrasena: '',
      patente: credentials['patente'] || '',
      foto: '',
      viaje: null,
      numero: null,
      tutoriales: {
        agendarViaje: false,
        programarViaje: false,
        editarViaje: false,
        perfilOtros: false,
      },
    }
    if (!this.userData.users.has(user.correo)) {
      this._encrypt.encrypt(credentials['contrasena']).subscribe(async (data) => {
        user.contrasena = data['Digest'];
        this.userData.users.set(user.correo, user);
        await this._storage.addData('usuarios', this.userData);
        await this._storage.addData('session', user);
        //! No se puede conectar a MongoDB aquí.
        //this._db.insertOne('usuarios', user);
        this._router.navigate(['/home']);
      });
      return true;
    } else {
      return false;
    }
  }

  async updateUser(user: Usuario) {
    this.userData.users.set(user.correo, user);
    await this._storage.addData('usuarios', this.userData);
    await this._storage.addData('session', user);
  }

  async changePassword(user: Usuario, password) {
    this._encrypt.encrypt(password).subscribe(async (data) => {
      user.contrasena = data['Digest'];
      this.userData.users.set(user.correo, user);
      await this._storage.addData('usuarios', this.userData);
      await this._storage.addData('session', user);
    });
  }

  userDoesExists(email: string) {
    return this.userData.users.has(email);
  }

  async verifyMail(email: string, code: string) {
    let url = 'http://localhost:3000/send-mail';
    return this._http.post(url, { type: 'verify', to: email, code: code }).subscribe(d => {
      console.log('Data: ' + d)
    });
  }

  async recoverPassword(email: string, code: string, username: string) {
    let url = 'http://localhost:3000/send-mail';
    return this._http.post(url, { type: 'recover', to: email, code: code, name: username });
  }

  async verifyPhone(phone: number, code: string) {
    let url = 'http://localhost:3000/send-sms';
    return this._http.post(url, { type: 'verify', phone: phone, code: code }).subscribe(d => {
      console.log('Data: ' + d)
    });
  }
}