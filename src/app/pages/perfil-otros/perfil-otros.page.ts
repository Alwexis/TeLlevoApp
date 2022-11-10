import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Usuario } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { ReportesService } from 'src/app/services/reportes.service';
import { ValoracionService } from 'src/app/services/valoracion.service';

@Component({
  selector: 'app-perfil-otros',
  templateUrl: './perfil-otros.page.html',
  styleUrls: ['./perfil-otros.page.scss'],
})
export class PerfilOtrosPage implements OnInit {
  //? Usuario sesión
  usuario: Usuario = {
    correo: '',
    contrasena: '',
    rut: '',
    nombre: '',
    patente: '',
    foto: '',
    viaje: null,
    numero: null,
  }
  //? Usuario a mostrar
  usuarioAMostrar: Usuario = {
    correo: '',
    contrasena: '',
    rut: '',
    nombre: '',
    patente: '',
    foto: '',
    viaje: null,
    numero: null,
  }

  valoracion = [];

  // Esto es sólo para rellenar, luego hay que cambiarlo.
  reporte = {
    motivo: '',
    descripcion: ''
  }

  constructor(private _modalCtrl: ModalController, private _alertCtrl: AlertController,
    private _route: ActivatedRoute, private _auth: AuthService,
    private _valoracion: ValoracionService, private _reportes: ReportesService) { }

  ngOnInit() {
    this.loadData();
  }

  async loadData() {
    //? Cargar usuario
    this.usuario = await this._auth.getSession();
    //? Cargar usuario a mostrar
    this._route.queryParams.subscribe(params => {
      if (params) this.usuarioAMostrar = this._auth.getUser(params.correo) as Usuario;
    });
    //? Cargar valoración
    this.valoracion = await this._valoracion.getValoracion(this.usuarioAMostrar);
    //this.valoracion = this._valoracion.getValoracion(this.usuario);
    //console.log(this.valoracion.constructor)
  }

  async closeModal() {
    await this._modalCtrl.dismiss('modal', 'cancelar')
  }

  async onSubmit(form: NgForm) {
    await this._reportes.reportUser(this.usuario, this.usuarioAMostrar, { motivo: this.reporte.motivo, descripcion: this.reporte.descripcion });
    const alert = await this._alertCtrl.create({
      header: '¡Éxito!',
      subHeader: 'Reportaste con éxito',
      message: 'Has reportado con éxito al usuario ' + this.usuarioAMostrar.nombre + '. Presiona "OK" para volver a su Perfil.',
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
