import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-perfil-otros',
  templateUrl: './perfil-otros.page.html',
  styleUrls: ['./perfil-otros.page.scss'],
})
export class PerfilOtrosPage implements OnInit {

  // Esto es sólo para rellenar, luego hay que cambiarlo.
  calificacion = 3.5;
  reporte = {
    motivo: '',
    descripcion: ''
  }

  constructor(private modalCtrl: ModalController, private alertController: AlertController) { }

  ngOnInit() {
    this.loadQualification();
  }

  loadQualification() {
    let qualification = document.getElementsByClassName('calificacion')[0];
    let halfStar = this.calificacion % 1;
    for (let x = 0; x < this.calificacion - halfStar; x++) {
      qualification.innerHTML += `<ion-icon name="star"></ion-icon>`;
    }
    if (halfStar > 0) qualification.innerHTML += `<ion-icon name="star-half"></ion-icon>`;
    for (let x = 0; x < (5 - this.calificacion) - halfStar; x++) {
      qualification.innerHTML += `<ion-icon name="star-outline"></ion-icon>`;
    }
    qualification.innerHTML += `<span style="color: black; border-bottom: 1px solid black; margin-left: 1vh;">${this.calificacion}</span>`
  }

  async closeModal() {
    await this.modalCtrl.dismiss('modal', 'cancelar')
  }

  async onSubmit(form: NgForm) {
    const alert = await this.alertController.create({
      header: '¡Éxito!',
      subHeader: 'Reportaste con éxito',
      message: 'Has reportado con éxito al usuario Jenniffer Coñuel. Presiona "OK" para volver a su Perfil.',
      backdropDismiss: false,
      buttons: [{
        text: 'OK',
        role: 'ok',
        handler: () => {
          this.closeModal();
          form.reset();
        },
      }],
      mode: 'ios',
    });

    await alert.present();
  }

}
