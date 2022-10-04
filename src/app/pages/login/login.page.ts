import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { LoginState } from 'src/app/enums/login-state';
import { Usuario } from 'src/app/interfaces/usuario';
import { Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: Usuario;
  userData: Usuarios;
  credenciales = {
    correo: '',
    contrasena: '',
  }
  // El guión bajo en las variables es una convención para indicar que es una variable privada.
  constructor(private _alertCtrl: AlertController, private _auth: AuthService) { }

  ngOnInit() {
  }

  async onSubmit() {
    await this._auth.login(this.credenciales);
  }
}