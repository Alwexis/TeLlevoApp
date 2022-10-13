import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuarios';
import { Viaje, Viajes } from '../interfaces/viajes';
import { StorageService } from './storage.service';
import { ViajeStatus } from '../enums/viaje-status';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  viajesData: Viajes;

  constructor(private _storage: StorageService) {}

  async init() {
    this.viajesData = await this._storage.getData('viajes'); 
    if (this.viajesData == undefined || this.viajesData == null) {
      this.viajesData = await this._storage.addData('viajes', { viajes: new Map<string, Viaje>(), lastId: 0 });
    }
  }

  getFrom(user: Usuario) {
    let viajes = [];
    this.viajesData.viajes.forEach(viaje => {
      if (viaje.conductor.correo === user.correo) {
        viajes.push(viaje);
      }
    })
    return viajes;
    //* Probar el return de abajo
    //? [...this.viajesData.viajes.values()].filter(viaje => viaje.conductor.correo == user.correo)
  }

  get() {
    return this.viajesData;
  }

  getViaje(id) {
    return this.viajesData.viajes.get(id);
  }

  async scheduleViaje(viaje: {}) {
    this.viajesData.lastId++;
    let newViaje: Viaje = {
      id: this.viajesData.lastId,
      fecha: viaje['fecha'],
      destino: viaje['destino'],
      precio: viaje['precio'],
      capacidad: viaje['capacidad'],
      descripcion: viaje['descripcion'],
      conductor: viaje['conductor'],
      pasajeros: [],
      valoraciones: [],
      estatus: ViajeStatus.PENDING,
    }
    this.viajesData.viajes.set(this.viajesData.lastId.toString(), newViaje);
    let added = await this._storage.addData('viajes', this.viajesData);
    return added != null;
  }

  async removeViaje(id) {
    if (this.viajesData.viajes.has(id)) {
      this.viajesData.viajes.delete(id);
      await this._storage.addData('viajes', this.viajesData);
      return true;
    } else {
      return false;
    }
  }
}
