import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuarios';
import { Valoracion, Valoraciones } from '../interfaces/valoracion';
import { Viaje } from '../interfaces/viajes';
import { DbService } from './db.service';
import { StorageService } from './storage.service';
import { ViajesService } from './viajes.service';

@Injectable({
  providedIn: 'root'
})
export class ValoracionService {
  valoraciones: Valoraciones = {
    valoraciones: new Map<string, Valoracion>(),
    lastId: 0
  }

  constructor(private _storage: StorageService, private _viajes: ViajesService,
    private _db: DbService) {}

  async init() {
    const valoraciones = await this._db.get('valoracion') as [];
    this.valoraciones = { valoraciones: new Map(valoraciones.map((valoracion) => [valoracion['id'], valoracion])), lastId: 0 };
  }

  async getValoracion(user: Usuario) {
    let viajes = await this._viajes.getFrom(user);
    viajes = viajes.map(x => x.id);
    let valoracion = 0;
    let total = 0;
    this.valoraciones.valoraciones.forEach(x => {
      if (viajes.includes(x.viaje)) {
        valoracion += x.valoracion;
        total++;
      }
    })
    let valoracionFinal = valoracion / total || 0;
    return [valoracionFinal, total];
  }

  async getValoracionesFrom(id) {
    const valoraciones = await this._db.get('Valoracion', ["viaje=" + id]);
    return valoraciones;
  }

  async userDidRate(user: string, viaje) {
    return false;
  }

  async addValoracion(viaje: Viaje, usuario: Usuario, calificacion: number, comentario: string = '') {
    this.valoraciones.lastId++;
    let valoracion: Valoracion = {
      id: this.valoraciones.lastId,
      viaje: viaje.id,
      usuario: usuario.correo,
      valoracion: calificacion,
      comentario: comentario
    }
    let added = await this._db.insertOne('Valoracion', valoracion, true);
    await this.init();
    return added != null;
  }

  async deleteValoracion(id: number) {
    await this._db.deleteOne('Valoracion', ["id=" + id]);
    await this.init();
  }
}
