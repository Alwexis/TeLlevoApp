import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuarios';
import { Valoracion, Valoraciones } from '../interfaces/valoracion';
import { Viaje } from '../interfaces/viajes';
import { StorageService } from './storage.service';
import { ViajesService } from './viajes.service';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  valoraciones: Valoraciones = {
    valoraciones: [],
    lastId: 0
  }

  constructor(private _storage: StorageService, private _viajes: ViajesService) {}

  async init() {
    this.valoraciones = await this._storage.getData('valoraciones');
    if (this.valoraciones == null) {
      this.valoraciones = await this._storage.addData('valoraciones', { valoraciones: [], lastId: 0 });
    }
    return this.valoraciones;
  }

  getValoracion(user: Usuario) {
    let viajes = this._viajes.getFrom(user).map(x => x.id);
    let valoracion = 0;
    let valoraciones = this.valoraciones.valoraciones.filter(x => viajes.includes(x.viaje));
    valoraciones.forEach(x => { valoracion += x.valoracion; });
    let valoracionFinal = valoracion / valoraciones.length || 0;
    let total = valoraciones.length;
    return [valoracionFinal, total];
  }

  getValoracionesFrom(id) {
    return this.valoraciones.valoraciones.filter(x => x.viaje == id);
  }

  userDidRate(user: string, viaje) {
    return this.getValoracionesFrom(viaje).find(x => x.usuario == user);
  }

  addValoracion(viaje: Viaje, usuario: Usuario, calificacion: number, comentario: string = '') {
    this.valoraciones.lastId++;
    let valoracion: Valoracion = {
      id: this.valoraciones.lastId,
      viaje: viaje.id,
      usuario: usuario.correo,
      valoracion: calificacion,
      comentario: comentario
    }
    this.valoraciones.valoraciones.push(valoracion);
    this._storage.addData('valoraciones', this.valoraciones);
  }

  deleteValoracion(id: number) {
    this.valoraciones.valoraciones = this.valoraciones.valoraciones.filter(x => x.id != id);
    this._storage.addData('valoraciones', this.valoraciones);
  }
}
