import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credenciales = {
    correo: '',
    contrasena: '',
  }

  usuario = {
    correo: '',
    rut: '',
    nombre: '',
    patente: '',
    foto: '',
    viaje: -1,
  }

  constructor(private router: Router, private alertController: AlertController, private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async onSubmit() {
    if (this.credenciales.correo.toLowerCase() == 'ar.silva@profesor.duoc.cl' && this.credenciales.contrasena == '12345') {
      this.usuario.correo = this.credenciales.correo;
      this.usuario.nombre = 'Ariel Silva';
      this.usuario.rut = '20.919.721-9';
      this.usuario.patente = 'aa-bb-11';
      this.usuario.foto = 'https://art.pixilart.com/cdd473d638b52f1.png'

      let navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario,
        }
      }
      this.router.navigate(['/home'], navigationExtras)
    } else if (this.credenciales.correo.toLowerCase() == 'je.conuel@duocuc.cl' && this.credenciales.contrasena == '54321') {
      this.usuario.correo = this.credenciales.correo;
      this.usuario.nombre = 'Jenniffer Coñuel';
      this.usuario.rut = '20.144.450-9';
      this.usuario.patente = '';
      this.usuario.foto = 'https://i.pinimg.com/564x/fd/2e/b1/fd2eb14b99702200b2b1807dffbe4792.jpg'
      this.usuario.viaje = 1;

      let navigationExtras: NavigationExtras = {
        state: {
          usuario: this.usuario,
        }
      }
      this.router.navigate(['/home'], navigationExtras)
    } else {
      await this.badLoginCredentials();
    }
  }

  async badLoginCredentials() {
    const alert = await this.alertController.create({
      header: '¡Error!',
      subHeader: 'Usuario y/o contraseña incorrectos',
      message: 'Los datos que ha ingresado son incorrectos. Por favor, intente nuevamente.',
      buttons: ['OK'],
      mode: 'ios',
      cssClass: 'datoserroneos',
      // Las alertas son componentes globales, por lo que para editar su CSS por ejemplo, hay que editarlo en el archivo
      // global.scss que está en la carpeta src.
    });

    await alert.present();
  }

  async modalActions(type) {
    if (type.toLowerCase() == 'close') {
      await this.modalCtrl.dismiss('modal', 'cancelar')
    } else if (type.toLowerCase() == 'accept') {
      console.log("uwu")
    }
  }
}