import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'reputacion',
  templateUrl: './valoracion.component.html',
  styleUrls: ['./valoracion.component.scss'],
})
export class ValoracionComponent implements OnInit {

  @Input() valoracion: number;
  @Input() total: number;

  constructor() { }

  ngOnInit() {
    console.log(this.valoracion)
    if (this.valoracion > 0) {
      let qualification = document.getElementsByClassName('calificacion')[0];
      let halfStar = this.valoracion % 1;
      for (let x = 0; x < this.valoracion - halfStar; x++) {
        qualification.innerHTML += `<ion-icon name="star"></ion-icon>`;
      }
      if (halfStar > 0) qualification.innerHTML += `<ion-icon name="star-half"></ion-icon>`;
      for (let x = 0; x < (5 - this.valoracion) - halfStar; x++) {
        qualification.innerHTML += `<ion-icon name="star-outline"></ion-icon>`;
      }
    }
  }

  loadQualification() {
    //let qualification = document.getElementsByClassName('calificacion')[0];
    //let halfStar = this.calificacion % 1;
    //for (let x = 0; x < this.calificacion - halfStar; x++) {
    //  qualification.innerHTML += `<ion-icon name="star"></ion-icon>`;
    //}
    //if (halfStar > 0) qualification.innerHTML += `<ion-icon name="star-half"></ion-icon>`;
    //for (let x = 0; x < (5 - this.calificacion) - halfStar; x++) {
    //  qualification.innerHTML += `<ion-icon name="star-outline"></ion-icon>`;
    //}
    //qualification.innerHTML += `<span style="color: black; border-bottom: 1px solid black; margin-left: 1vh;">${this.calificacion}</span>`
  }

}
