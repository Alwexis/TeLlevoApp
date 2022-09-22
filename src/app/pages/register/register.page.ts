import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

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

  usuario = {
    correo: '',
    rut: '',
    nombre: '',
    patente: '',
  }

  codigo;

  //@ViewChild('pwConfirmModel') pwConfirmModel: NgModel;
  @ViewChild('registerform') registerform: NgForm;

  constructor(private modalCtrl: ModalController, private router: Router) { }

  ngOnInit() {
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

  lastStepRegistration() {
    this.credenciales.extension = this.credenciales.rawExtension == 'alumno' ? '@duocuc.cl' : '@profesor.duoc.cl';
    this.codigo = Math.random().toString(36).substring(2,9).toUpperCase();
    console.log(this.codigo);
  }
  
  async modalActions(type) {
    if (type.toLowerCase() == 'close') {
      await this.modalCtrl.dismiss('modal', 'cancelar')
    } else if (type.toLowerCase() == 'accept') {
      if (this.credenciales.codigo == this.codigo) {
        this.usuario.correo = this.credenciales.correo + this.credenciales.extension;
        this.usuario.nombre = this.credenciales.nombre;
        this.usuario.rut = this.credenciales.rut;
        this.usuario.patente = this.credenciales.conductor ? this.credenciales.patente : '';
 
        let navigationExtras: NavigationExtras = {
          state: {
            usuario: this.usuario,
          }
        }
        this.router.navigate(['/home'], navigationExtras)
        await this.modalCtrl.dismiss('modal', 'aceptar')
      }
    }
  }

  // Esto esta malo y hay que preguntarle al profe como arreglarlo XD.
  /*
  async fetchData(url: string) {
    const response = await fetch(url);
    const data = await response.text();
    return data;
  }

  async getPersonalInformationByRut(rut) {
    console.log(rut)
    const rawData = await this.fetchData("https://www.nombrerutyfirma.com/rut?term=" + rut);
    // parsing the data
    const data = cheerio.load(rawData);
    console.log(data);
  }
  */
}
