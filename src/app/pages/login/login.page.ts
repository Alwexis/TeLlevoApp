import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Usuario, Usuarios } from 'src/app/interfaces/usuarios';
import { AuthService } from 'src/app/services/auth.service';
import { DbService } from 'src/app/services/db.service';
import { EncrypterService } from 'src/app/services/encrypter.service';

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
  };
  // El guión bajo en las variables es una convención para indicar que es una variable privada.
  constructor(private _auth: AuthService, private _db: DbService) {}

  ngOnInit() {
  }

  async onSubmit() {
    // eslint-disable-next-line no-underscore-dangle
    await this._auth.login(this.credenciales);
  }
}
