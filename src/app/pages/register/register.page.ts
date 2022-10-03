import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuario';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { EncrypterService } from 'src/app/services/encrypter.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credenciales = {
    correo: '',
    rawExtension: '',
    extension: '',
    rut: '',
    nombre: '',
    contrasena: '',
    contrasena2: '',
    conductor: false,
    patente: '',
    condiciones: false,
    codigo: '',
  }

  usuario: Usuario;
  userData: Usuarios;

  codigo;

  @ViewChild('registerform') registerform: NgForm;

  constructor(private _modalCtrl: ModalController, private _router: Router,
    private _storage: StorageService, private _toastCtrl: ToastController,
    private _auth: AuthService) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    this.userData = await this._storage.getData('usuarios');
  }

  conductorChange() {
    //this.credenciales.conductor ? document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: flex;") : document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: none;");
    if (this.credenciales.conductor) {
      document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: flex;");
      this.registerform.form.get('patente').setValidators([Validators.required]);
      this.registerform.form.get('patente').updateValueAndValidity();
    } else {
      document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: none;");
      this.registerform.form.get('patente').clearValidators();
      this.registerform.form.get('patente').updateValueAndValidity();
    }
  }

  checkPasswords(p1, p2) {
    if (p1 != p2 && (p1.length > 0 && p2.length > 0)) {
      this.registerform.form.controls['contrasena2'].setErrors({ 'incorrect': true });
      return true;
    }
    return false;
  }

  async lastStepRegistration() {
    this.credenciales.extension = this.credenciales.rawExtension == 'alumno' ? '@duocuc.cl' : '@profesor.duoc.cl';
    if (!this.userData.users.has(this.credenciales.correo + this.credenciales.extension)) {
      this.codigo = Math.random().toString(36).substring(2, 9).toUpperCase();
      console.log(this.codigo);
    } else {
      const toast = await this._toastCtrl.create({
        message: '¡Error! Ya existe un usuario con ese correo',
        icon: 'close-circle-outline',
        duration: 3000,
        buttons: [
          {
            text: 'Cerrar',
            role: 'cerrar',
            icon: 'close-circle-outline',
            handler: () => {
              toast.dismiss('ok');
            }
          }
        ]
      });
      await toast.present();
      await this._modalCtrl.dismiss('modal', 'cancelar')
    }
  }

  async register() {
    if (this.codigo == this.credenciales.codigo) {
      let wasRegistered = await this._auth.registerUser(this.credenciales);
      if (wasRegistered) {
        await this._modalCtrl.dismiss('modal')
        const toast = await this._toastCtrl.create({
          message: '¡Bienvenido a bordo!',
          icon: 'happy-outline',
          duration: 3000,
          buttons: [
            {
              text: 'Ver tu Perfil',
              role: 'perfil',
              icon: 'person-circle-outline',
              handler: () => {
                toast.dismiss('ok');
                this._modalCtrl.dismiss('modal', 'cancelar');
                this._router.navigate(['perfil-usuario']);
              }
            }
          ]
        });
        await toast.present();
      } else {
        await this._modalCtrl.dismiss('modal', 'cancelar');
        const toast = await this._toastCtrl.create({
          message: '¡Error! Ya existe un usuario con ese correo',
          icon: 'close-circle-outline',
          duration: 3000,
          buttons: [
            {
              text: 'Cerrar',
              role: 'cerrar',
              icon: 'close-circle-outline',
              handler: () => {
                toast.dismiss('ok');
              }
            }
          ]
        });
        await toast.present();
      }
    }
  }

  async modalActions(type) {
    if (type.toLowerCase() == 'close') {
      await this._modalCtrl.dismiss('modal', 'cancelar')
    }
  }
}
