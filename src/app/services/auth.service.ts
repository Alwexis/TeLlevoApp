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
import { RegisterStatus } from '../enums/register-status';
import { Network } from '@awesome-cordova-plugins/network/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: Usuarios;
  session: Session;

  constructor(private _storage: StorageService, private _encrypt: EncrypterService,
    private _router: Router, private _toastCtrl: ToastController, private _alertCtrl: AlertController,
    private _http: HttpClient, private _db: DbService,
    private _network: Network) {
  }

  // ! No eliminar aún; hay que cargar datos offline con LocalStorage :p
  /**
   @deprecated
   */
  async loadDataOffline() {
    this.session = await this._storage.getData('session');
    this.userData = await this._storage.getData('usuarios');
    if (this.userData == undefined || this.userData == null) {
      this.userData = await this._storage.addData('usuarios', { users: new Map<string, {}>() });
    }
    return this.userData;
  }

  async loadData() {
    if (this._network.type.includes('none')) {
      await this.loadDataOffline();
    } else {
      // Obtengo a los usuarios como una lista y luego la mapeo para que tenga sentido el interface.
      await this.refreshUsers();
      const sessionID = await this._storage.getData('session');
      if (sessionID != null) {
        this.session.user = this.userData.users.get(sessionID['correo']) as Usuario;
      }
    }
  }

  async refreshUsers() {
    const usuarios = await this._db.get('Usuarios') as [];
    this.userData = { users: new Map(usuarios.map((user) => [user['correo'], user])) };
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
    const user: Usuario = {
      correo: this.session['correo'],
      rut: this.session['rut'],
      nombre: this.session['nombre'],
      contrasena: this.session['contrasena'],
      patente: this.session['patente'],
      foto: this.session['foto'],
      viaje: this.session['viaje'],
      numero: this.session['numero'],
    };
    return user;
  }

  async logout() {
    await this._storage.removeData('session', 0);
    this._router.navigate(['/login']);
    const toast = await this._toastCtrl.create({
      message: '¡Hasta pronto!',
      duration: 2000,
      icon: 'exit-outline'
    });
    await toast.present();
    location.reload();
  }

  async loginOffline(credentials: {}) {
    const alert = await this._alertCtrl.create({ header: '¡Error!', buttons: ['OK'], mode: 'ios', cssClass: 'datoserroneos', });
    if (this.userData.users.has(credentials['correo'])) {
      let user: Usuario = this.userData.users.get(credentials['correo']) as Usuario;
      const encryptedPwd = this._encrypt.localEncrypt(credentials['contrasena'])
      if (user.contrasena === encryptedPwd) {
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
    } else {
      alert.subHeader = 'Usuario no encontrado';
      alert.message = 'El correo electrónico que ha ingresado no está registrado. Por favor, intente nuevamente.';
      await alert.present();
      return LoginState.USER_NOT_FOUND;
    }
  }

  async login(credentials: {}) {
    if (this._network.type.includes('none')) {
      return this.loginOffline(credentials);
    }
    const alert = await this._alertCtrl.create({ header: '¡Error!', buttons: ['OK'], mode: 'ios', cssClass: 'datoserroneos', });
    if (this.userData.users.has(credentials['correo'])) {
      let user: Usuario = this.userData.users.get(credentials['correo']) as Usuario;
      const encryptedPwd = this._encrypt.localEncrypt(credentials['contrasena'])
      if (user.contrasena === encryptedPwd) {
        //? Agregar usuario al caché (LocalStorage)
        this.session = await this._storage.addData('session', user);
        let users = await this._storage.getData('usuarios');
        if (users) {
          users.users.set(user.correo, user);
        } else {
          users = { users: new Map<string, {}>() };
          users.users.set(user.correo, user);
        }
        this._storage.addData('usuarios', users);
        //? Fin de caché
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
    }
    if (!this.userData.users.has(user.correo)) {
      if (!this.rutDoesExists(user.rut)) {
        const encryptedPwd = this._encrypt.localEncrypt(credentials['contrasena']);
        user.contrasena = encryptedPwd;
        //? Agregar usuario al caché (LocalStorage)
        await this._storage.addData('session', user);
        let users = await this._storage.getData('usuarios');
        users.users.set(user.correo, user);
        this._storage.addData('usuarios', users);
        //? Fin de caché
        this._db.insertOne('Usuarios', user);
        await this.refreshUsers();
        this._router.navigate(['/home']);
        return RegisterStatus.SUCCESSFUL;
      }
      return RegisterStatus.RUT_ALREADY_EXISTS;
    }
    return RegisterStatus.ALREADY_REGISTERED;
  }

  /**
    @deprecated
    */
  async _updateUser(user: Usuario) {
    this.userData.users.set(user.correo, user);
    await this._storage.addData('usuarios', this.userData);
    await this._storage.addData('session', user);
  }

  /**
    @param { Usuario } user Usuario a actualizar 
    */
  async updateUser(user: Usuario) {
    this._db.updateOne('usuarios', ['correo=' + user.correo], user);
    await this._storage.addData('session', user);
    await this.refreshUsers();
  }

  /**
    @deprecated
    */
  async _changePassword(user: Usuario, password) {
    this._encrypt.encrypt(password).subscribe(async (data) => {
      user.contrasena = data['Digest'];
      this.userData.users.set(user.correo, user);
      await this._storage.addData('usuarios', this.userData);
      await this._storage.addData('session', user);
    });
  }

  /**
    @param { Usuario } user Usuario a actualizar
    @param { string } password Nueva contraseña
    */
  async changePassword(user: Usuario, password: string) {
    const encryptedPwd = this._encrypt.localEncrypt(password);
    user.contrasena = encryptedPwd;
    this._db.updateOne('Usuarios', ['correo=' + user.correo], user);
    await this.refreshUsers();
  }

  userDoesExists(email: string) {
    return this.userData.users.has(email);
  }

  rutDoesExists(rut: string) {
    for (let usuario of this.userData.users.keys()) {
      if (this.userData.users.get(usuario)['rut'] == rut) {
        return true;
      }
    }
    return false;
  }

  async verifyMail(email: string, code: string, username: string) {
    let url = 'http://localhost:3000/send-mail';
    return this._http.post(url, { type: 'verify', to: email, code: code, name: username }).subscribe(d => {
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