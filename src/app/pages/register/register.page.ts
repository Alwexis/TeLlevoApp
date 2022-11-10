import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { RegisterStatus } from 'src/app/enums/register-status';
import { Usuario, Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
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
  codigo;

  @ViewChild('registerform') registerform: NgForm;

  constructor(private _modalCtrl: ModalController, private _router: Router,
    private _storage: StorageService, private _toastCtrl: ToastController,
    private _auth: AuthService) { }

  ngOnInit() {
  }

  conductorChange() {
    //this.credenciales.conductor ? document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: flex;") : document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: none;");
    if (this.credenciales.conductor) {
      document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: flex; flex-direction: column;");
      document.getElementsByClassName('patenteInput')[0].setAttribute("required", "");
      //this.registerform.form.get('patente').setValidators([Validators.required]);
      //this.registerform.form.get('patente').updateValueAndValidity();
    } else {
      document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: none;");
      document.getElementsByClassName('patenteInput')[0].removeAttribute("required");
      //this.registerform.form.get('patente').clearValidators();
      //this.registerform.form.get('patente').updateValueAndValidity();
    }
  }

  checkPasswords() {
    if (this.credenciales.contrasena != '' && this.credenciales.contrasena2 != '') {
      if (this.credenciales.contrasena != '' && this.credenciales.contrasena2 != '') {
        if (this.credenciales.contrasena != this.credenciales.contrasena2) {
          this.registerform.form.controls['contrasena2'].setErrors({ 'incorrect': true });
          return false;
        } else {
          this.registerform.form.controls['contrasena2'].setErrors(null);
          return true;
        }
      }
    }
    return true;
  }

  async lastStepRegistration() {
    const toast = await this._toastCtrl.create({
      icon: 'close-circle-outline',
      duration: 3000,
      buttons: [{
        text: 'Cerrar',
        role: 'cerrar',
        icon: 'close-circle-outline',
        handler: () => {
          toast.dismiss('ok');
        }
      }]
    });
    this.credenciales.extension = this.credenciales.rawExtension == 'alumno' ? '@duocuc.cl' : '@profesor.duoc.cl';
    if (!this._auth.userDoesExists(this.credenciales.correo + this.credenciales.extension)) {
      if (!this._auth.rutDoesExists(this.credenciales.rut)) {
        this.codigo = Math.random().toString(36).substring(2, 9).toUpperCase();
        console.log('Este es el código. Pero prueba ir a tu correo <3 ' + this.codigo);
        await this._auth.verifyMail(this.credenciales.correo + this.credenciales.extension, this.codigo, this.credenciales.nombre);
      } else {
        toast.message = '¡Error! Ya existe un usuario con ese rut';
        await toast.present();
        await this._modalCtrl.dismiss('modal', 'cancelar')
      }
    } else {
      toast.message = '¡Error! Ya existe un usuario con ese correo';
      await toast.present();
      await this._modalCtrl.dismiss('modal', 'cancelar')
    }
  }

  async register() {
    if (this.codigo == this.credenciales.codigo) {
      let wasRegistered = await this._auth.registerUser(this.credenciales);
      if (wasRegistered === RegisterStatus.SUCCESSFUL) {
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
                this._router.navigate(['perfil']);
              }
            }
          ]
        });
        await toast.present();
      } else {
        await this._modalCtrl.dismiss('modal', 'cancelar');
        const toast = await this._toastCtrl.create({
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
        if (wasRegistered === RegisterStatus.ALREADY_REGISTERED) {
          toast.message = '¡Error! Ya existe un usuario con ese correo';
        } else if (wasRegistered === RegisterStatus.RUT_ALREADY_EXISTS) {
          toast.message = '¡Error! Ya existe un usuario con ese rut';
        } else {
          toast.message = '¡Error! No se pudo registrar el usuario';
        }
        await toast.present();
      }
    }
  }

  formatString(type: string) {
    if (type === 'rut') {
      const idealPattern = /[0-9]{2}\.[0-9]{3}\.[0-9]-([0-9]|k)/;
      const acceptablePattern = /[0-9]{2}(\.?)[0-9]{3}(\.?)[0-9]{3}(\.?)(-?)[0-9k]/;
      if (idealPattern.test(this.credenciales.rut)) return;
      if (acceptablePattern.test(this.credenciales.rut)) {
        const newRut = this.credenciales.rut.replace('-', '');
        let rut = newRut.substring(0, newRut.length - 1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        let dv = newRut.substring(newRut.length - 1);
        this.credenciales.rut = rut + '-' + dv;
      }
    } else if (type === 'patente') {
      const idealPattern = /^[a-zA-Z]{2}-[a-zA-Z0-9]{2}-[a-zA-Z0-9]{2}$/;
      const acceptablePattern = /^[a-zA-Z]{2}(-?)[a-zA-Z0-9]{2}(-?)[a-zA-Z0-9]{2}$/;
      if (idealPattern.test(this.credenciales.patente)) return;
      if (acceptablePattern.test(this.credenciales.patente)) {
        this.credenciales.patente = this.credenciales.patente.match(/[a-zA-Z0-9]{2}/g).join("-").toUpperCase();
      }
    }
  }

  async modalActions(type) {
    if (type.toLowerCase() == 'close') {
      await this._modalCtrl.dismiss('modal', 'cancelar')
    }
  }
}
