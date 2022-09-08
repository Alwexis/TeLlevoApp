import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  credenciales = {
    correo: '',
    rut: '',
    nombre: '',
    contrasena: '',
    conductor: false,
    patente: '',
  }

  constructor() { }

  ngOnInit() {
  }

  conductorChange() {
    this.credenciales.conductor ? document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: flex;") : document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: none;");
    /*
    Lo de arriba es lo mismo que la condición de abajo, sólo que usé algo llamado "Operador Ternario".
    Pregunta si tienes dudas.

    if (this.credenciales.conductor) {
      // Esto sirve para cambiarle el atributo style, que es lo del CSS. Cambié el display de none a flex para que se viera.
      // el document.getElementsByClassName('patenteInput')[0] es el elemento que quiero cambiarle el atributo. Le puse el [0] porque
      // devuelve una lista y solo necesito el primer objeto
      document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: flex;");
    } else {
      document.getElementsByClassName('patenteInput')[0].setAttribute("style", "display: none;");
    }
    */
  }
}
