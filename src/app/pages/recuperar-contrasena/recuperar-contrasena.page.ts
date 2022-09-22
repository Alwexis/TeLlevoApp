import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  generateCode() {
    if (this.codigoAutorizacion == '') {
      this.codigoAutorizacion = Math.random().toString(36).substring(2,9).toUpperCase();
      console.log(this.codigoAutorizacion);
    }
  }

  async onSubmit(form: NgForm) {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      subHeader: 'Cambiaste tu contraseña',
      message: 'Has cambiado tu contraseña con éxito. Volverás al menú de inicio de sesión al apretar "OK".',
      backdropDismiss: false,
      buttons: [{
          text: 'OK',
          role: 'ok',
          handler: () => {
            this.router.navigate(['/login']);
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
