import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { text } from 'cheerio/lib/api/manipulation';

@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
})
export class ProgramarViajePage implements OnInit {

  viaje = {
    fecha: undefined as Date, // si
    hora: undefined as Time, // si
    destino: '', // si
    precio: 0, // si
    capacidad: 0, // si
    descripcion: '', // Opcional
  }

  viajes = new Map();

  constructor(private _modalCtrl: ModalController, private _toastCtrl: ToastController,
    private _alertCtrl: AlertController) { }

  ngOnInit() {
  }

  chooseOption(option: string) {
    console.log(option);
  }

  async confirmarViaje(type: string) {
    if (type === 'un_viaje') {
      if (this.viaje.fecha != undefined && this.viaje.hora != undefined && this.viaje.destino != '' && this.viaje.precio > 0 && this.viaje.capacidad > 0) {
        this._modalCtrl.dismiss(this.viaje, 'confirmar');
        // <ion-icon name="today-outline"></ion-icon>
        let buttons = [{
          text: 'Lista de Viajes',
          role: 'lista_de_viajes',
          handler: () => { console.log('Ir a la Lista de Viajes') }
        }]
        this.sendToast('¡Viaje programado! Puedes verlo en tu lista de Viajes', 'today-outline', buttons);
      } else {
        this.sendToast('¡Completa todos los campos no opcionales!', 'alert-circle-outline');
      }
    } else {
      if (this.viajes.size > 0) {
        this._modalCtrl.dismiss(this.viajes, 'confirmar');
        let buttons = [{
          text: 'Lista de Viajes',
          role: 'lista_de_viajes',
          handler: () => { console.log('Ir a la Lista de Viajes') }
        }]
        this.sendToast('¡Viajes programados! Puedes verlos en tu lista de Viajes', 'today-outline', buttons);
      } else {
        this.sendToast('¡Completa todos los campos no opcionales!', 'alert-circle-outline');
      }
    }
  }

  async sendToast(msg: string, icon: string = undefined, buttons = undefined) {
    const toast = await this._toastCtrl.create({
      message: msg,
      duration: 3000,
    });
    if (icon != undefined) toast.icon = icon;
    if (buttons != undefined) toast.buttons = buttons;
    await toast.present();
  }

  async addViajeMenu() {
    let lastId = this.viajes.size + 1;
    const alert = await this._alertCtrl.create({
      header: 'Por favor rellena los campos',
      mode: 'ios',
      backdropDismiss: false,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            this._alertCtrl.dismiss('un_calendario', 'cancel')
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: (alertData) => {
            let parsedFecha = new Date(alertData.fecha);
            let viaje = {
              id: lastId,
              fecha: (parsedFecha.getDate() + 1) + '/' + (parsedFecha.getMonth() + 1),
              hora: alertData.hora,
              destino: alertData.destino,
              precio: alertData.precio,
              capacidad: alertData.capacidad,
              descripcion: alertData.descripcion,
            }
            this.viajes.set(lastId, viaje);
            document.getElementsByClassName('viajes-list')[0].innerHTML += `
            <ion-item-sliding class='viaje-${lastId}'>
              <ion-item>
                <div class='viaje-card'>
                  <span style='margin-right: 1vh;'>${viaje.fecha} - ${viaje.hora}</span>
                  <span>${viaje.destino}</span>
                </div>
              </ion-item>
              <ion-item-options side="end">
                <ion-item-option color="danger" class="delete">
                  <ion-icon slot="icon-only" name="trash"></ion-icon>
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>`;
            let item = document.getElementsByClassName(`viaje-${lastId}`)[0];
            item.children[1].children[0].addEventListener('click', () => {
              this.deleteViaje(lastId);
            });
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Ingresa el destino',
          type: 'text',
          name: 'destino',
        },
        {
          placeholder: 'Ingresa el precio',
          type: 'number',
          name: 'precio'
        },
        {
          placeholder: 'Ingresa la capacidad',
          type: 'number',
          name: 'capacidad'
        },
        {
          placeholder: 'Ingresa el dia',
          label: 'Ingresa el dia',
          type: 'date',
          name: 'fecha'
        },
        {
          placeholder: 'Ingresa la hora',
          label: 'Ingresa la hora',
          type: 'time',
          name: 'hora'
        },
        {
          placeholder: 'Descripción',
          type: 'textarea',
          name: 'descripcion'
        }
      ],
    });

    await alert.present();
  }

  deleteViaje(id) {
    this.viajes.delete(id);
    document.getElementsByClassName('viajes-list')[0].removeChild(document.getElementsByClassName(`viaje-${id}`)[0]);
  }
}
